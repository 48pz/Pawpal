import { useFieldArray, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import AvatarCropModal from "../settings/AvatarCropModal";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { FaDog } from "react-icons/fa";
import Button from "../Button";

const inputClass =
  "w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition";

const ConfirmModal = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  danger = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-[#0f172a] w-[420px] rounded-2xl p-6 border border-white/10">
        <h3 className="text-white font-semibold mb-3">{title}</h3>
        <p className="text-sm text-gray-300 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={onConfirm}
            className={
              danger ? "bg-rose-600 text-white hover:bg-rose-500" : undefined
            }
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

const DogSection = () => {
  const { register, control, getValues, reset } = useForm({
    defaultValues: { dogs: [] },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "dogs",
  });

  const [avatarOpenIndex, setAvatarOpenIndex] = useState(null);

  const [deleteIndex, setDeleteIndex] = useState(null);
  const [finalConfirm, setFinalConfirm] = useState(false);


  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const res = await api.get("/api/v1/dog");

        const dogs = res.data.dogs.map((dog) => ({
          id: dog._id,
          name: dog.name,
          breed: dog.breed,
          age: dog.age,
          avatarPreview: dog.avatarUrl || null,
          avatarBlob: null,
        }));

        reset({ dogs });
      } catch {
        toast.error("Failed to load dogs");
      }
    };

    fetchDogs();
  }, [reset]);


  const handleDogAvatarConfirm = ({ preview, blob }) => {
    if (avatarOpenIndex === null) return;

    const currentDog = getValues(`dogs.${avatarOpenIndex}`);

    update(avatarOpenIndex, {
      ...currentDog,
      avatarPreview: preview,
      avatarBlob: blob,
    });

    setAvatarOpenIndex(null);
  };

  const handleSaveDog = async (index) => {
    const dog = getValues(`dogs.${index}`);

    const formData = new FormData();
    formData.append("name", dog.name);
    formData.append("breed", dog.breed);
    formData.append("age", dog.age);

    if (dog.avatarBlob) {
      formData.append("avatar", dog.avatarBlob);
    }

    try {
      if (dog.id) {
        await api.put(`/api/v1/dog/${dog.id}`, formData);
        toast.success("Dog updated");
      } else {
        const res = await api.post("/api/v1/dog", formData);
        update(index, {
          ...dog,
          id: res.data.dog._id,
          avatarPreview: res.data.dog.avatarUrl || dog.avatarPreview,
          avatarBlob: null,
        });
        toast.success("Dog created");
      }
    } catch {
      toast.error("Failed to save dog");
    }
  };


  const confirmDeleteDog = async () => {
    const dog = getValues(`dogs.${deleteIndex}`);

    try {
      if (!dog.id) {
        remove(deleteIndex);
        toast.success("Dog removed");
      } else {
        await api.delete(`/api/v1/dog/${dog.id}`);
        remove(deleteIndex);
        toast.success("Dog deleted permanently");
      }
    } catch {
      toast.error("Failed to delete dog");
    } finally {
      setDeleteIndex(null);
      setFinalConfirm(false);
    }
  };

  return (
    <>
      <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4">My Dogs</h2>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-[#020617] rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                  {field.avatarPreview ? (
                    <img
                      src={field.avatarPreview}
                      className="w-full h-full object-cover"
                      alt="dog avatar"
                    />
                  ) : (
                    <FaDog className="text-2xl text-white/80" />
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAvatarOpenIndex(index)}
                >
                  {field.avatarPreview ? "Change avatar" : "Add avatar"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  placeholder="Name"
                  {...register(`dogs.${index}.name`, { required: true })}
                  className={inputClass}
                />
                <input
                  placeholder="Breed"
                  {...register(`dogs.${index}.breed`)}
                  className={inputClass}
                />
                <input
                  placeholder="Age"
                  {...register(`dogs.${index}.age`)}
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button size="sm" onClick={() => handleSaveDog(index)}>
                  Save
                </Button>

                <Button
                  size="sm"
                  onClick={() => setDeleteIndex(index)}
                  className="bg-rose-600 text-white hover:bg-rose-500"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={() =>
              append({
                id: null,
                name: "",
                breed: "",
                age: "",
                avatarPreview: null,
                avatarBlob: null,
              })
            }
            className="bg-emerald-600 text-white hover:bg-emerald-500"
          >
            + Add Dog
          </Button>
        </div>
      </div>

      <AvatarCropModal
        open={avatarOpenIndex !== null}
        onClose={() => setAvatarOpenIndex(null)}
        onConfirm={handleDogAvatarConfirm}
      />

      <ConfirmModal
        open={deleteIndex !== null && !finalConfirm}
        title="Delete dog?"
        message="This will permanently delete this dog."
        confirmText="Continue"
        danger
        onCancel={() => setDeleteIndex(null)}
        onConfirm={() => setFinalConfirm(true)}
      />

      <ConfirmModal
        open={finalConfirm}
        title="Are you absolutely sure?"
        message="This action cannot be undone."
        confirmText="Delete permanently"
        danger
        onCancel={() => {
          setFinalConfirm(false);
          setDeleteIndex(null);
        }}
        onConfirm={confirmDeleteDog}
      />
    </>
  );
};

export default DogSection;
