import {prisma} from "@/app";
import {_str, jsonConfig, SALT, schemaDotenv} from "@/config";
import docsJson from "@/json/docs.json";
import {listItemIds, url} from "@/utils";
import {createHandler} from "@/utils/create";

export async function getRootApiDocs() {
  const users = await prisma.user.findMany();
  const userIds = listItemIds(users);
  const userUrls = userIds.map((id) => url(`user/${id}`));

  docsJson.items.map((route) => ({
    ...route,
    slug: route.name.includes("user/:id") ? undefined : url(route.name),
    items: route.name.includes("user/:id") ? userUrls : undefined,
  }))

  return {
    ...docsJson,
    items: docsJson.items.map(({name, ...route}) => ({
      slug: name.includes("user/:id") ? userUrls : url(name),
      ...route,
    })),
    config: {
      SALT,
      ...schemaDotenv.parse(process.env),
      ...jsonConfig
    },
    strings: _str,
  };
}

export const getRootApiDocsHandler = createHandler(async (req, res) => {
  res.json(await getRootApiDocs());
});