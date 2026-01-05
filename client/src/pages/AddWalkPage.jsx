import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AppHeader from "../components/AppHeader";
import Footer from "../components/layout/Footer";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../lib/api";

import LocationPicker from "../components/walks/LocationPicker";

const AddWalkPage = () => {
  const navigate = useNavigate();

  const [dogs, setDogs] = useState([]);
  const [selectedDogs, setSelectedDogs] = useState([]);

  const [time, setTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(5);
  const [location, setLocation] = useState(null);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/v1/dog");
        setDogs(res.data?.dogs || []);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load your dogs.");
      }
    })();
  }, []);

  const toggleDog = (dogId) => {
    setSelectedDogs((prev) =>
      prev.includes(dogId)
        ? prev.filter((id) => id !== dogId)
        : [...prev, dogId]
    );
  };

  const validate = () => {
    const e = {};

    if (!time) e.time = "Time is required";
    else {
      const dt = new Date(time);
      if (Number.isNaN(dt.getTime())) e.time = "Time is invalid";
      else if (dt.getTime() < Date.now()) e.time = "Time must be in the future";
    }

    if (!location?.lat || !location?.lng || !location?.name) {
      e.location = "Location is required (click on the map)";
    }

    const mp = Number(maxParticipants);
    if (!Number.isFinite(mp) || mp < 1 || mp > 10) {
      e.maxParticipants = "Max participants must be 1-10";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const canSubmit = useMemo(() => {
    return !!time && !!location?.lat && !submitting;
  }, [time, location, submitting]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post("/api/v1/walks", {
        time,
        dogs: selectedDogs,
        maxParticipants: Number(maxParticipants),
        location,
      });

      toast.success("Walk created successfully.");
      setTimeout(() => {
        navigate("/walks");
      }, 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Create walk failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />

      <main className="pt-20 max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#111] border border-white/10 rounded-3xl shadow-lg p-6 md:p-8">
            <div className="text-center">
              <h1
                className="text-5xl md:text-6xl mb-3"
                style={{ fontFamily: "'Baloo 2', cursive" }}
              >
                Create Walk
              </h1>
              <p className="text-gray-400 text-sm">
                Pick a time, select a location, and choose which dogs you’ll
                bring.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={onSubmit}>
              {/* Time */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Time</label>
                <div className="w-full">
                  <Input
                    type="datetime-local"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder=""
                  />
                </div>
                {errors.time ? (
                  <p className="mt-1 text-xs text-red-400">{errors.time}</p>
                ) : null}
              </div>

              {/* Location */}
              <LocationPicker
                value={location}
                onChange={setLocation}
                error={errors.location}
              />

              {/* Dogs */}
              <div>
                <div className="flex items-end justify-between mb-2">
                  <label className="text-sm text-gray-300">Dogs</label>
                  <span className="text-xs text-gray-500">
                    {selectedDogs.length} selected
                  </span>
                </div>

                {dogs.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">
                    No dogs found. You can still create a walk.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {dogs.map((d) => {
                      const checked = selectedDogs.includes(d._id);
                      return (
                        <button
                          key={d._id}
                          type="button"
                          onClick={() => toggleDog(d._id)}
                          className={`rounded-2xl border px-4 py-4 text-left transition
                            ${
                              checked
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-white/10 bg-black/30 hover:border-white/20"
                            }
                          `}
                        >
                          <p className="text-sm font-semibold text-white truncate">
                            {d.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {checked ? "Selected" : "Tap to select"}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Max participants */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Max participants (1-10)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  placeholder="5"
                />
                {errors.maxParticipants ? (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.maxParticipants}
                  </p>
                ) : null}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={!canSubmit}
                size="lg"
                className="w-full mt-2"
              >
                {submitting ? "Creating..." : "Create Walk"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Back
                </button>
              </div>
            </form>
          </div>

          <div className="flex justify-center mt-6">
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddWalkPage;
