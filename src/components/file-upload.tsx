// "use client";

// import { UploadDropzone } from "@/lib/uploadthing";
// import "@uploadthing/react/styles.css";

// interface FileUploadProps {
//   onFileUpload: (url: string) => void; // Callback to handle uploaded file URL
//   endpoint: "msgFile" | "serverImage" | "excelFile";
// }

// export const FileUpload = ({ onFileUpload, endpoint }: FileUploadProps) => {
//   return (
//     <div className="bg bg-white">
//       <UploadDropzone
//         endpoint={endpoint}
//         onClientUploadComplete={(res) => {
//           if (res && res[0]?.url) {
//             onFileUpload(res[0].url); // Pass the uploaded file URL back to the parent
//             alert("Upload Completed");
//           }
//         }}
//         onUploadError={(error: Error) => {
//           alert(`ERROR! ${error.message}`);
//         }}
//       />
//     </div>
//   );
// };
