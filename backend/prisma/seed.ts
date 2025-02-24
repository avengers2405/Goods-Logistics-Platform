import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

async function main(){
    await prisma.user.createMany({
        data: [{
            firstName: "Shreekar",
            lastName: "Gade",
            email: "shreekargade2004@gmail.com",
            clerkId: "kuchbhi0",
            phone: "6969696969",
            credits: 0
        },{
            firstName: "Akshit",
            lastName: "Mishra",
            email: "akshitmishra24@gmail.com",
            clerkId: "kuchbhi1",
            phone: "9696969696",
            credits: 0
        }]
    });
}

main();