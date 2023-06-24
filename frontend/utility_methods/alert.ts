import Swal from 'sweetalert2'

export const showAlert = async (icon: any, title: any) => {

  const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'bg-success'
    },
  });
  toast.fire({
    icon: icon,
    title: title,
    padding: '10px 20px',
  });

}

export const showPrompt = async (icon: any, title: string, text:string, confirmButton:string, callBack:any) => {


  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonText: confirmButton,
    padding: '2em',
    customClass: 'sweet-alerts',
  }).then((result) => {
    if (result.value) {
      callBack()
    }
  });


}