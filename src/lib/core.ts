// import { error } from "console";
// import Error from "next/error";
// import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";
 
// const f = createUploadthing();
//  console.log("hi")
//  const handleAuth = () => {
//     console.log("in the handleauth") 
//     console.log(`authentication done`)
 
// }; // Fake auth function
 
// // FileRouter for your app, can contain multiple FileRoutes
// export const ourFileRouter = {
//   // Existing image upload route
//   serverImage: f({ image: { maxFileSize: "4MB" } })
//     .onUploadComplete(async ({ metadata, file }) => {
//       console.log("Upload complete for userId:", metadata.userId);
//       console.log("file url", file.url);
//       return { uploadedBy: metadata.userId };
//     }),
  
//   // New route for Excel files
//   excelFile: f({ 
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { 
//       maxFileSize: "16MB" 
//     },
//     "application/vnd.ms-excel": { 
//       maxFileSize: "16MB" 
//     }
//   })
//     .onUploadComplete(async ({ metadata, file }) => {
//       console.log("Excel file upload complete for userId:", metadata.userId);
//       console.log("Excel file url", file.url);
//       return { uploadedBy: metadata.userId };
//     }),

//   // Existing msgFile route
//   msgFile: f(["image", "pdf"])
     
//     .onUploadComplete(() => {})
// } satisfies FileRouter;