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