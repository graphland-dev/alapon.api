// import {
//   userAtom,
//   userPermissionsAtom,
//   userTenantsAtom,
// } from "@/common/states/user.atom";
// import { ApolloError, gql, useQuery } from "@apollo/client";
// import { LoadingOverlay } from "@mantine/core";
// import { useAtom } from "jotai";
// import React, { PropsWithChildren, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   RolePermission,
//   TenantsWithPagination,
//   User,
// } from "../api-models/graphql";
// import { $triggerRefetchMe } from "../rxjs-controllers";

// const GET_USER_QUERIES = gql`
//   query GET_USER_QUERIES {
//     identity__me {
//       _id
//       email
//       name
//       memberships {
//         tenant
//         roles
//       }
//       avatar {
//         key
//         provider
//       }
//     }
//     identity__myTenants {
//       nodes {
//         _id
//         name
//         uid
//         address {
//           caption
//           lat
//           lng
//         }
//         businessPhoneNumber
//         description
//         createdAt
//         logo {
//           key
//           provider
//         }
//       }
//     }
//   }
// `;

// const GET_USER_PERMISSIONS = gql`
//   query GET_USER_PERMISSIONS($tenant: String!) {
//     identity__myPermissions(tenant: $tenant) {
//       collectionName
//       actions
//     }
//   }
// `;

// export const AuthGuardedWrapper: React.FC<PropsWithChildren> = ({
//   children,
// }) => {
//   const params = useParams<{ tenant: string }>();
//   const navigate = useNavigate();

//   const [, setGlobalUser] = useAtom(userAtom);
//   const [, setUserPermissions] = useAtom(userPermissionsAtom);
//   const [, setUserTenants] = useAtom(userTenantsAtom);

//   const {
//     loading,
//     refetch,
//     data: meAPiData,
//   } = useQuery<{
//     identity__me: User;
//     identity__myTenants: TenantsWithPagination;
//   }>(GET_USER_QUERIES, {
//     skip: !params?.tenant,
//     fetchPolicy: "network-only",
//     onCompleted(data) {
//       console.log("AuthGuard:GET_USER_QUERIES", { data });
//       setGlobalUser(data?.identity__me);
//       setUserTenants(data?.identity__myTenants?.nodes || []);
//     },
//     onError: (error: ApolloError) => {
//       console.log("AuthGuard", { error });
//       navigate("/auth/login");
//     },
//   });

//   useQuery(GET_USER_PERMISSIONS, {
//     variables: { tenant: params?.tenant },
//     skip: !params?.tenant,
//     onCompleted(data) {
//       console.log("AuthGuard:GET_USER_PERMISSIONS", { data });
//       setUserPermissions(data?.identity__myPermissions);
//     },
//     onError: (error: ApolloError) => {
//       console.log("AuthGuard", { error });
//       navigate("/auth/login");
//     },
//   });

//   useEffect(() => {
//     $triggerRefetchMe.subscribe(() => {
//       refetch();
//     });
//   }, []);

//   return (
//     <div className="relative">
//       <LoadingOverlay
//         visible={loading}
//         opacity={10000}
//         overlayProps={{
//           blur: 1000,
//         }}
//       />
//       {children}
//     </div>
//   );
// };
