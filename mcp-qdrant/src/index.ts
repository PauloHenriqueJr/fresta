import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { QdrantClient } from "@qdrant/js-client-rest";
import { z } from "zod";

// Initialize Qdrant Client
const client = new QdrantClient({ url: "http://localhost:6333" });

const server = new Server(
  {
    name: "mcp-qdrant",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define Schemas
const CreateCollectionSchema = z.object({
  name: z.string(),
  vectors: z.object({
    size: z.number(),
    distance: z.enum(["Cosine", "Euclid", "Dot"]),
  }),
});

const ListCollectionsSchema = z.object({});

const UpsertPointsSchema = z.object({
  collection_name: z.string(),
  points: z.array(
    z.object({
      id: z.union([z.string(), z.number()]),
      vector: z.array(z.number()),
      payload: z.record(z.any()).optional(),
    })
  ),
});

const SearchPointsSchema = z.object({
  collection_name: z.string(),
  vector: z.array(z.number()),
  limit: z.number().optional().default(10),
  filter: z.record(z.any()).optional(),
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_collection",
        description: "Create a new collection in Qdrant",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string" },
            vectors: {
              type: "object",
              properties: {
                size: { type: "number" },
                distance: { type: "string", enum: ["Cosine", "Euclid", "Dot"] },
              },
              required: ["size", "distance"],
            },
          },
          required: ["name", "vectors"],
        },
      },
      {
        name: "list_collections",
        description: "List all collections in Qdrant",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "upsert_points",
        description: "Upsert points into a collection",
        inputSchema: {
          type: "object",
          properties: {
            collection_name: { type: "string" },
            points: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: ["string", "number"] },
                  vector: { type: "array", items: { type: "number" } },
                  payload: { type: "object" },
                },
                required: ["id", "vector"],
              },
            },
          },
          required: ["collection_name", "points"],
        },
      },
      {
        name: "search_points",
        description: "Search for similar vectors in a collection",
        inputSchema: {
          type: "object",
          properties: {
            collection_name: { type: "string" },
            vector: { type: "array", items: { type: "number" } },
            limit: { type: "number" },
            filter: { type: "object" },
          },
          required: ["collection_name", "vector"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "create_collection") {
      const { name, vectors } = CreateCollectionSchema.parse(args);
      await client.createCollection(name, { vectors });
      return {
        content: [{ type: "text", text: `Collection '${name}' created successfully.` }],
      };
    }

    if (name === "list_collections") {
      const collections = await client.getCollections();
      return {
        content: [{ type: "text", text: JSON.stringify(collections, null, 2) }],
      };
    }

    if (name === "upsert_points") {
      const { collection_name, points } = UpsertPointsSchema.parse(args);
      await client.upsert(collection_name, { points });
      return {
        content: [{ type: "text", text: `Successfully upserted ${points.length} points to '${collection_name}'.` }],
      };
    }

    if (name === "search_points") {
      const { collection_name, vector, limit, filter } = SearchPointsSchema.parse(args);
      const results = await client.search(collection_name, {
        vector,
        limit,
        filter,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid arguments: ${error.message}`);
    }
    throw error;
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
