import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import PostPage from "./pages/PostPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationPage from "./pages/NotificationPage";
import AddWalkPage from "./pages/AddWalkPage";
import WalksPage from "./pages/WalksPage";
import WalkDetailPage from "./pages/WalkDetailPage";
import PawpediaPage from "./pages/PawpediaPage";
import PawpediaDetailPage from "./pages/PawpediaDetailPage";
import UserRelationListPage from "./pages/UserRelationListPage";
import OAuthSuccessPage from "./pages/OAuthSuccessPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/walks" element={<WalksPage />} />
        <Route path="/walks/new" element={<AddWalkPage />} />
        <Route path="/walks/:id" element={<WalkDetailPage />} />
        <Route path="/pawpedia" element={<PawpediaPage />} />
        <Route path="/pawpedia/:slug" element={<PawpediaDetailPage />} />
        <Route path="/profile/followers" element={<UserRelationListPage />} />
        <Route path="/profile/followings" element={<UserRelationListPage />} />
        <Route path="/oauth-success" element={<OAuthSuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
