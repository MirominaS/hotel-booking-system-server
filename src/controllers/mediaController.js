import Media from "../models/Media.js";
import { uploadToR2, deleteFromR2, s3 } from "../services/mediaService.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { folder, type } = req.body;

    const allowedFolders = [
      "hotel-images",
      "room-images",
      "hotel-licenses",
      "owner-nic",
    ];

    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: "Invalid folder",
      });
    }

    let visibility = "admin-use";

    if (folder === "hotel-images" || folder === "room-images") {
      visibility = "public";
    }

    let editable = true;

    if (folder === "hotel-licenses" || folder === "owner-nic") {
      editable = false;
    }

    // image validation
    if (type === "image") {
      const allowed = ["image/jpeg", "image/png", "image/webp"];

      if (!allowed.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Invalid image type",
        });
      }
    }

    // document validation
    if (type === "document") {
      const allowed = ["application/pdf", "image/jpeg", "image/png"];

      if (!allowed.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Invalid document type",
        });
      }
    }

    const result = await uploadToR2(req.file, folder);

    const media = await Media.create({
      key: result.key,
      uploadedBy: req.user._id,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      folder,
      type,
      visibility,
      editable,
    });

    console.log("REQ FILE:", {
      originalname: req.file?.originalname,
      mimetype: req.file?.mimetype,
      size: req.file?.size,
      hasBuffer: !!req.file?.buffer,
    });

    res.status(201).json({
      success: true,
      media,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:");
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMediaAccessUrl = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    console.log("REQ USER:", req.user);
    console.log("MEDIA OWNER:", media.uploadedBy.toString());
    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    // Public images
    if (media.visibility === "public") {
      const url = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: media.key,
        }),
        {
          expiresIn: 3600,
        },
      );

      return res.json({
        success: true,
        url,
      });
    }

    // Private documents
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    if (
      media.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: media.key,
      }),
      {
        expiresIn: 300,
      },
    );

    res.json({
      success: true,
      url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    if (media.folder === "owner-nic" || media.folder === "hotel-licenses") {
      return res.status(403).json({
        success: false,
        message: "Verification documents cannot be deleted.",
      });
    }

    if (
      media.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await deleteFromR2(media.key);

    await media.deleteOne();

    res.json({
      success: true,
      message: "Media deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    if (media.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (media.editExpiresAt && media.editExpiresAt < new Date()) {
      media.editable = false;
      media.editGrantedByAdmin = false;
      media.editGrantedAt = null;
      media.editGrantedBy = null;
      media.editExpiresAt = null;

      await media.save();

      return res.status(403).json({
        success: false,
        message: "Edit permission has expired",
      });
    }

    // Cannot edit locked document
    if (!media.editable) {
      return res.status(403).json({
        success: false,
        message: "This document cannot be edited. Contact admin.",
      });
    }

    // Delete old file
    await deleteFromR2(media.key);

    // Upload new file
    const result = await uploadToR2(req.file, media.folder);

    media.key = result.key;
    media.originalName = req.file.originalname;
    media.mimeType = req.file.mimetype;
    media.size = req.file.size;

    // revoke temporary permission
    media.editable = false;
    media.editGrantedByAdmin = false;
    media.editGrantedAt = null;
    media.editGrantedBy = null;
    media.editExpiresAt = null;

    await media.save();

    res.json({
      success: true,
      media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const grantEditAccess = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    media.editable = true;
    media.editGrantedByAdmin = true;
    media.editGrantedBy = req.user._id;
    media.editGrantedAt = new Date();

    media.editExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await media.save();

    res.json({
      success: true,
      message: "Edit access granted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyMedia = async (req, res) => {
  try {
    const media = await Media.find({
      uploadedBy: req.user._id,
    }).sort({
      createdAt: -1,
    });

    const folders = [
      {
        key: "hotel-images",
        name: "Hotel Images",
        type: "image",
        files: media.filter((m) => m.folder === "hotel-images"),
      },

      {
        key: "room-images",
        name: "Room Images",
        type: "image",
        files: media.filter((m) => m.folder === "room-images"),
      },

      {
        key: "hotel-licenses",
        name: "Hotel Licenses",
        type: "document",
        files: media.filter((m) => m.folder === "hotel-licenses"),
      },

      {
        key: "owner-nic",
        name: "Owner NIC",
        type: "document",
        files: media.filter((m) => m.folder === "owner-nic"),
      },
    ];

    res.json({
      success: true,
      folders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPublicMedia = async (req, res) => {
  const media = await Media.find({
    visibility: "public",
  });

  res.json({
    success: true,
    media,
  });
};
