import Swal from "sweetalert2";

type Icon = "warning" | "error" | "success" | "info" | "question";

export const showAlert = async (icon: Icon, title: string) => {
  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: { popup: "bg-success" },
  });

  toast.fire({
    icon,
    title,
    padding: "10px 20px",
  });
};

export const showPrompt = async (icon: Icon, title: string, text: string, confirmButton: string, callBack: () => void) => {
  Swal.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmButton,
    padding: "2em",
    customClass: "sweet-alerts",
  }).then((result) => {
    if (result.value) {
      callBack();
    }
  });
};
