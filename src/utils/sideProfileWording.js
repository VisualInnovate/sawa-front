// Side profile questions carry a title and a yes/no answer wording per gender:
// { male: { title, yes, no }, female: { title, yes, no } }.
export const genders = ["male", "female"];

export const emptyWording = () => ({
  male: { title: "", yes: "", no: "" },
  female: { title: "", yes: "", no: "" },
});

// A question row from the API (`{ id, title, wording }`); questions saved before the wording existed
// fall back to their single title for both genders.
export function questionWording(row) {
  const wording = emptyWording();
  for (const gender of genders) {
    const saved = row?.wording?.[gender] ?? {};
    wording[gender] = {
      title: String(saved.title || row?.title || ""),
      yes: String(saved.yes ?? ""),
      no: String(saved.no ?? ""),
    };
  }
  return wording;
}

// children.gender: "0" is a boy and "1" a girl.
export const childGender = (child) => (String(child?.gender) === "1" ? "female" : "male");

// The question as the specialist reads it for this child.
export const titleForChild = (row, child) => questionWording(row)[childGender(child)].title;
