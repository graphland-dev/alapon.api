// import { useState } from "react";
// import { $http } from "../clients/http";
// import { DirectoryName } from "../models/DirectoryName.enum";

// export const useServerFile = () => {
//   // loading states
//   const [uploading, setUploading] = useState<boolean>(false);
//   const [deleting, setDeleting] = useState<boolean>(false);

//   const uploadFile = async (body: {
//     files: File[];
//     directory: DirectoryName;
//     unique?: boolean;
//   }) => {
//     // loader
//     setUploading(true);

//     // create form data for upload files
//     const fd = new FormData();

//     // files directory
//     if (body.directory) {
//       fd.append("directory", body.directory);
//     }

//     // unique naming of files
//     if (body.unique) {
//       fd.append("unique", "true");
//     }

//     // append files to FormData
//     body?.files?.map((file: File) => fd.append("files", file));

//     // post  files to server
//     const res = await $http.post(`/files`, fd);
//     if (res?.data?.files?.length) {
//       setUploading(false);
//       return res?.data?.files;
//     } else {
//       setUploading(false);
//       return;
//     }
//   };

//   // delete files from server
//   const deleteFiles = async (keys: string[]) => {
//     setDeleting(true);
//     return $http
//       .delete("/files", { data: { keys } })
//       .finally(() => setDeleting(false));
//   };

//   return {
//     uploadFile,
//     uploading,
//     deleting,
//     deleteFiles,
//   };
// };
