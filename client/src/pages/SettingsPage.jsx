import AppHeader from "../components/AppHeader";
import Footer from "../components/layout/Footer";
import SettingsForm from "../components/settings/SettingsForm"

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />
      <main className="pt-20 max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <SettingsForm />
      </main>

      <div className="flex justify-center">
        <Footer />
      </div>
    </div>
  );
};

export default SettingsPage;
