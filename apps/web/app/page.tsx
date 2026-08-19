// This file intentionally left minimal.
// The root '/' route is served by app/(marketing)/page.tsx
// which renders the landing page without the app sidebar.
// Authenticated pages live under app/(app)/* with the sidebar layout.
export { default } from './(marketing)/page';
