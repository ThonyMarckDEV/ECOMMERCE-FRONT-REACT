import React from 'react';
import Swal from 'sweetalert2';

// Función para mostrar una alerta básica
const showBasicAlert = () => {
  Swal.fire('Hello world!');
};

// Función para mostrar una alerta con título y mensaje
const showMessageAlert = (title, message, icon = 'info') => {
  Swal.fire({
    title: title,
    text: message,
    icon: icon,
    confirmButtonText: 'Aceptar',
  });
};

// Función para mostrar una alerta de éxito
const showSuccessAlert = (title, message) => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'success',
    confirmButtonText: 'Aceptar',
  });
};

// Función para mostrar una alerta de error
const showErrorAlert = (title, message) => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'error',
    confirmButtonText: 'Reintentar',
  });
};

// Función para mostrar una alerta con input
const showInputAlert = (title, inputPlaceholder) => {
  Swal.fire({
    title: title,
    input: 'text',
    inputLabel: 'Por favor, ingresa algo:',
    inputPlaceholder: inputPlaceholder,
    showCancelButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(`¡Hola, ${result.value}!`);
    }
  });
};

// Función para mostrar una alerta con temporizador
const showTimerAlert = (title, message, timer = 2000) => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'info',
    timer: timer,
    showConfirmButton: false,
  });
};

// Función para mostrar una alerta con confirmación (sí/no)
const showConfirmationAlert = (title, message) => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('Eliminado', 'El ítem fue eliminado correctamente.', 'success');
    } else {
      Swal.fire('Cancelado', 'No se realizó ninguna acción.', 'info');
    }
  });
};

// Función para mostrar una alerta con acciones personalizadas
const showActionAlert = (title, message, actions, callback) => {
  Swal.fire({
    title: title,
    text: message,
    icon: 'question',
    showCancelButton: false,
    showConfirmButton: false,
    html: `
      <div>
        ${actions
          .map(
            (action) =>
              `<button class="swal2-confirm swal2-styled" style="margin: 5px;" onclick="window.selectedAction = '${action}'">${action}</button>`
          )
          .join('')}
      </div>
    `,
    didOpen: () => {
      // Asignar la acción seleccionada al hacer clic en un botón
      document.querySelectorAll('.swal2-confirm').forEach((button) => {
        button.addEventListener('click', () => {
          Swal.close();
        });
      });
    },
  }).then((result) => {
    if (window.selectedAction) {
      callback(window.selectedAction);
      window.selectedAction = null; // Limpiar la selección
    }
  });
};

const SweetAlert = {
  showBasicAlert,
  showMessageAlert,
  showSuccessAlert,
  showErrorAlert,
  showInputAlert,
  showTimerAlert,
  showConfirmationAlert,
  showActionAlert, // Agregar la nueva función
};

export default SweetAlert;