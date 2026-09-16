
const Index = () => import("../views/SideProfile/Index.vue");
const Show = () => import("../views/SideProfile/Show.vue");
const Edit = () => import("../views/SideProfile/Edit.vue");
const Create = () => import("../views/SideProfile/Create.vue");

const sideProfilesRoutes = [
    {
        path: "side-profiles",
        name: "SideProfiles",
        meta: { permission: ["side profiles list"] },
        component: Index,
    },
    // create
    {
        path: "side-profiles/create",
        name: "CreateSideProfiles",
        meta: { permission: ["side profiles create"] },
        component: Create,
    },
    // show
    {
        path: "side-profiles/:id",
        name: "ShowSideProfiles",
        meta: { permission: ["side profiles list"] },
        component: Show,
    },
    // edit
    {
        path: "side-profiles/:id/edit",
        name: "EditSideProfiles",
        meta: { permission: ["side profiles edit"] },
        component: Edit,
    },
];

export default {
    ...sideProfilesRoutes,


};
