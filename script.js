// Funcionalidad para botón "Agregar al carrito"
document.addEventListener('click', function(e) {                     // Escucha TODOS los clics en la página
    if (e.target.classList.contains('btn-add-cart')) {              // Si el elemento clicado tiene la clase del botón "Agregar al carrito"
        const originalText = e.target.textContent;                  // Guarda el texto original del botón
        e.target.textContent = '✓ Agregado';                        // Cambia texto a "Agregado"
        e.target.style.background = 'linear-gradient(135deg, #4a7c59 0%, #5d9b6b 100%)'; // Cambia color a verde

        setTimeout(() => {                                          // Espera 2 segundos para revertir cambios
            e.target.textContent = originalText;                    // Restaurar texto original
            e.target.style.background = 'linear-gradient(135deg, #8B7A8F 0%, #6D5B70 100%)'; // Restaurar color original
        }, 2000);                                                   // Tiempo de espera = 2000 ms (2 segundos)
    }
});


// Funcionalidad del carrito de compras (para tienda.html)
document.addEventListener('click', function(e) {                    // Otro listener global para manejo del carrito

    // Eliminar item
    if (e.target.classList.contains('remove-btn')) {                // Si clic en botón eliminar
        const cartItem = e.target.closest('.cart-item-bs');         // Encuentra el contenedor del item
        if (cartItem) {                                             // Si existe el item…
            cartItem.style.animation = 'slideOut 0.3s ease';        // Aplica animación de deslizamiento
            setTimeout(() => {                                      // Espera 300ms hasta que acabe la animación
                cartItem.remove();                                  // Elimina el item del DOM
                updateCartTotal();                                  // Recalcula totales
            }, 300);
        }
    }

    // Aumentar cantidad
    if (e.target.classList.contains('qty-plus')) {                  // Si clic en "+"
        const input = e.target.parentElement.querySelector('.qty-input'); // Busca input de cantidad
        if (input) {
            const currentQty = parseInt(input.value);               // Convierte valor actual a número
            input.value = currentQty + 1;                           // Aumenta cantidad
            updateItemPrice(e.target.closest('.cart-item-bs'));     // Recalcula precio del item
            updateCartTotal();                                      // Recalcula total del carrito
        }
    }

    // Disminuir cantidad
    if (e.target.classList.contains('qty-minus')) {                 // Si clic en "-"
        const input = e.target.parentElement.querySelector('.qty-input'); // Busca input
        if (input) {
            const currentQty = parseInt(input.value);               // Valor actual como número
            if (currentQty > 1) {                                   // Solo permite bajar si es > 1
                input.value = currentQty - 1;                       // Reduce cantidad
                updateItemPrice(e.target.closest('.cart-item-bs')); // Recalcula precio por cantidad
                updateCartTotal();                                  // Actualiza total del carrito
            }
        }
    }

    // Finalizar compra
    if (e.target.classList.contains('a')) {                         // Si clic en botón finalizar compra
        alert('¡Gracias por tu compra! Serás redirigido al proceso de pago.'); // Muestra mensaje
    }
});


// Función para actualizar el precio de un item
function updateItemPrice(cartItem) {
    if (!cartItem) return;                                          // Evita errores si no se pasa item

    const quantity = parseInt(cartItem.querySelector('.qty-input').value); // Lee cantidad actual
    const priceElement = cartItem.querySelector('.item-price');     // Ubica el elemento precio

    if (!priceElement) return;                                      // Si no existe, termina función
    
    const basePrice = parseFloat(priceElement.dataset.basePrice);   // Lee precio base (unitario)
    const newPrice = (basePrice * quantity).toFixed(2);             // Nuevo precio = base × cantidad
    
    priceElement.textContent = 'Bs' + newPrice;                     // Muestra precio actualizado
}


// Función para actualizar el total del carrito
function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item-bs');   // Selecciona todos los items del carrito
    let subtotal = 0;                                               // Inicializa subtotal

    cartItems.forEach(item => {                                     // Recorre cada item
        const priceText = item.querySelector('.item-price').textContent; // Texto de precio (ej: "Bs12.50")
        const price = parseFloat(priceText.replace('Bs', ''));      // Remueve "Bs" y convierte a número
        subtotal += price;                                          // Suma al subtotal
    });

    const shipping = 5.00;                                          // Costo fijo de envío
    const discount = 0.00;                                          // Descuento (si hubiera)
    const total = subtotal + shipping - discount;                   // Fórmula del total

    // Actualiza los valores en pantalla
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = 'Bs' + subtotal.toFixed(2);
    if (shippingElement) shippingElement.textContent = 'Bs' + shipping.toFixed(2);
    if (discountElement) discountElement.textContent = '-Bs' + discount.toFixed(2);
    if (totalElement) totalElement.textContent = 'Bs' + total.toFixed(2);
}


// Animación CSS para eliminar items
const style = document.createElement('style');                      // Crea un tag <style>
style.textContent = `
    @keyframes slideOut {                                           // Animación personalizada
        from {
            opacity: 1;                                             // Comienza visible
            transform: translateX(0);                               // Sin desplazamiento
        }
        to {
            opacity: 0;                                             // Se desvanece
            transform: translateX(-100%);                           // Se desliza hacia la izquierda
        }
    }
`;
document.head.appendChild(style);                                   // Inserta animación en el documento


// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {          // Se ejecuta cuando la página está lista

    document.querySelectorAll('.cart-item-bs').forEach(item => {    // Para cada item del carrito
        const priceElement = item.querySelector('.item-price');     // Encuentra el elemento precio
        if (priceElement && priceElement.dataset.basePrice) {       // Si tiene precio base…
            const quantity = parseInt(item.querySelector('.qty-input').value); // Cantidad
            const basePrice = parseFloat(priceElement.dataset.basePrice);      // Precio unitario
            const displayPrice = (basePrice * quantity).toFixed(2); // Calcula precio inicial
            priceElement.textContent = 'Bs' + displayPrice;         // Coloca precio multiplicado
        }
    });

    updateCartTotal();                                              // Actualiza totales al iniciar
});
