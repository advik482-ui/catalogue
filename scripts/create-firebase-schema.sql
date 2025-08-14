-- Firebase Realtime Database Schema Structure
-- This is a reference for the JSON structure we'll create in Firebase

-- Users table structure
{
  "users": {
    "user_id_1": {
      "name": "string",
      "email": "string",
      "password": "string (hashed)",
      "role": "admin|user|manager",
      "status": "active|inactive|pending",
      "joinDate": "YYYY-MM-DD",
      "lastActive": "ISO timestamp",
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "profile": {
        "avatar": "string (url)",
        "phone": "string",
        "address": "string"
      }
    }
  },
  
  "catalogues": {
    "catalogue_id_1": {
      "name": "string",
      "description": "string",
      "slug": "string (unique)",
      "shareUrl": "string (unique)",
      "ownerId": "string (user_id)",
      "status": "active|inactive|draft",
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "settings": {
        "isPublic": "boolean",
        "allowComments": "boolean",
        "theme": "string"
      },
      "products": {
        "product_id_1": "boolean (true if included)"
      }
    }
  },
  
  "products": {
    "product_id_1": {
      "name": "string",
      "description": "string",
      "price": "number",
      "currency": "string",
      "category": "string",
      "images": ["string (urls)"],
      "status": "active|inactive|out_of_stock",
      "ownerId": "string (user_id)",
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "attributes": {
        "color": "string",
        "size": "string",
        "material": "string"
      }
    }
  },
  
  "categories": {
    "category_id_1": {
      "name": "string",
      "description": "string",
      "parentId": "string (category_id) or null",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
}
