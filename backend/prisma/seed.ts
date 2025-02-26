import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

async function main(){
    // await prisma.user.createMany({
    //     data: [{
    //         firstName: "Shreekar",
    //         lastName: "Gade",
    //         email: "shreekargade2004@gmail.com",
    //         clerkId: "kuchbhi0",
    //         phone: "6969696969",
    //         credits: 0
    //     },{
    //         firstName: "Akshit",
    //         lastName: "Mishra",
    //         email: "akshitmishra24@gmail.com",
    //         clerkId: "kuchbhi1",
    //         phone: "9696969696",
    //         credits: 0
    //     }]
    // });
    await prisma.user.createMany({
        data: [{
            firstName: "Omkar",
            lastName: "Gade",
            email: "omkargade2004@gmail.com",
            clerkId: "kuchbhi3",
            phone: "8372684093",
            credits: 0
        },{
            firstName: "Aryan",
            lastName: "Gore",
            email: "aryangore2905@gmail.com",
            clerkId: "kuchbhi4",
            phone: "7558374629",
            credits: 0
        }, {
            firstName: "Ayush",
            lastName: "Patil",
            email: "ayushbpatil@gmail.com",
            clerkId: "vsvksk5",
            phone: "7298928798",
            credits: 0
        }]
    });

    // await prisma.driver.createMany({
    //     data: [{
    //         firstName: "Aryan",
    //         lastName: "Havaldar",
    //         email: "aryan3456@gmail.com",
    //         clerkId: "kuchbhi6",

    //     }]
    // })
}

main();