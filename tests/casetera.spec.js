const { test, expect } = require('@playwright/test');

// Si en tu navegador entras con localhost en vez de 127.0.0.1, puedes cambiarlo aquí
const URL_PROYECTO = 'http://127.0.0.1:5500/index.html'; 

test.describe('Pruebas de Flujo y Estado - Reproductor de Cassette Retro', () => {

    test('Debería cargar con el estado inicial correcto (Apagado y Oculto)', async ({ page }) => {
        await page.goto(URL_PROYECTO);

        // 1. Validar que el panel lateral de "Mis Cassettes" inicie totalmente oculto
        const panelPlaylist = page.locator('#playlist-menu');
        await expect(panelPlaylist).not.toBeVisible();

        // 2. Validar que la luz LED inicie en estado apagado (rojo, sin la clase led-verde)
        const ledPower = page.locator('#led-estado-power');
        await expect(ledPower).not.toHaveClass(/led-verde/);

        // 3. Validar que si se intenta dar Play estando apagado, los carretes NO giren
        await page.click('#btn-play-pause');
        const carreteIzq = page.locator('#carrete-izq');
        await expect(carreteIzq).not.toHaveClass(/girando/);
    });

    test('Debería encender correctamente, cambiar el LED y permitir abrir la playlist', async ({ page }) => {
        await page.goto(URL_PROYECTO);

        // 1. Presionar el botón mecánico de POWER
        await page.click('#btn-stop');

        // 2. Verificar que el LED ahora sea verde
        const ledPower = page.locator('#led-estado-power');
        await expect(ledPower).toHaveClass(/led-verde/);

        // 3. Presionar el botón de la lista para ver las cintas disponibles
        await page.click('#btn-playlist');

        // 4. El panel lateral ahora SÍ debe ser visible para el usuario
        const panelPlaylist = page.locator('#playlist-menu');
        await expect(panelPlaylist).toBeVisible();
    });

    test('Debería activar la animación de giro al seleccionar un cassette con el aparato encendido', async ({ page }) => {
        await page.goto(URL_PROYECTO);

        // Encendemos el aparato e invocamos la lista
        await page.click('#btn-stop');
        await page.click('#btn-playlist');

        // Seleccionamos la primera cinta de la lista (Daniel, me estás matando...)
        const primeraCancion = page.locator('#lista-canciones li').first();
        await primeraCancion.click();

        // Comprobamos que los engranajes adquieran la clase de animación para simular el giro real
        const carreteIzq = page.locator('#carrete-izq');
        const carreteDer = page.locator('#carrete-der');
        await expect(carreteIzq).toHaveClass(/girando/);
        await expect(carreteDer).toHaveClass(/girando/);
    });
});