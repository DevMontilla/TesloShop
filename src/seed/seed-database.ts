import { initialData } from "./seed";
import prisma from "../lib/prisma";

async function main() {
  //    1. Borrar registros previos
  await Promise.all([
    prisma.orderAddress.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),

    prisma.userAddress.deleteMany(),
    prisma.user.deleteMany(),
    prisma.country.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
  ]);

  const { categories, products, users, countries } = initialData;

  await prisma.country.createMany({
    data: countries,
  });

  await prisma.user.createMany({
    data: users,
  });

  const categoriesData = categories.map((category) => ({
    name: category,
  }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();

  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>);

  //   Productos
  products.forEach(async (product) => {
    const { type, images, ...rest } = product;
    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });

  console.log("Seed executed");
}

(() => {
  if (process.env.NODE_ENV === "production") return;

  main();
})();
