import { useFieldArray, useForm } from "react-hook-form";

const DogSection = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      dogs: [{ name: "", breed: "", age: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dogs",
  });

  const onSaveDogs = async (data) => {
    console.log("Save dogs:", data.dogs);
    // TODO: api.put("/api/v1/dogs", data.dogs)
  };

  return (
    <form
      onSubmit={handleSubmit(onSaveDogs)}
      className="
        bg-[#0f172a]
        rounded-2xl
        p-6
        border border-white/5
      "
    >
      <h2 className="text-lg font-semibold text-white mb-4">My Dogs</h2>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="
              bg-[#020617]
              rounded-xl
              p-4
              border border-white/10
            "
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                placeholder="Name"
                className="
                  bg-transparent
                  border border-white/10
                  rounded-lg
                  px-3 py-2
                  text-sm text-white
                  placeholder-gray-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500/40
                  transition
                "
                {...register(`dogs.${index}.name`, { required: true })}
              />

              <input
                placeholder="Breed"
                className="
                  bg-transparent
                  border border-white/10
                  rounded-lg
                  px-3 py-2
                  text-sm text-white
                  placeholder-gray-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500/40
                  transition
                "
                {...register(`dogs.${index}.breed`)}
              />

              <input
                placeholder="Age"
                className="
                  bg-transparent
                  border border-white/10
                  rounded-lg
                  px-3 py-2
                  text-sm text-white
                  placeholder-gray-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500/40
                  transition
                "
                {...register(`dogs.${index}.age`)}
              />
            </div>

            {fields.length > 1 && (
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="
                    text-sm
                    text-red-400
                    hover:text-red-300
                    transition
                  "
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={() => append({ name: "", breed: "", age: "" })}
          className="
            px-4 py-2
            rounded-xl
            text-sm font-semibold
            bg-emerald-600
            hover:bg-emerald-500
            text-white
            transition
          "
        >
          + Add Dog
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            px-5 py-2.5
            rounded-xl
            text-sm font-semibold
            bg-blue-600
            hover:bg-blue-500
            text-white
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? "Saving..." : "Save Dogs"}
        </button>
      </div>
    </form>
  );
};

export default DogSection;
