export class TemplateEmailService {
  static armarPlantillaRecordatorioEvento(
    evento: string,
    descripcion: string,
    imagenBuffer: Buffer,
    logo: Buffer
  ) {
    const imagenBase64 = imagenBuffer.toString('base64')
    const imagenUrl = `data:image/jpeg;base64,${imagenBase64}`
    const logoBase64 = logo.toString('base64')
    const logoUrl = `data:image/jpeg;base64,${logoBase64}`
    return `
    <!DOCTYPE html>
    <html lang='es'>
      <head>
        <meta charset='UTF-8'>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 640px;
            margin: 0 auto;
            background: #ffffff;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo {
            max-width: 100px;
            height: auto;
            display: block;
            margin: 0 auto;
          }
          .image {
            width: 100%;
            max-width: 100%;
            height: auto;
            margin-top: 10px;
            border-radius: 10px;
          }
          .message {
            font-size: 16px;
            color: #333333;
            line-height: 1.5;
            margin-top: 20px;
          }
        </style>
        <title>Recordatorio de evento</title>
      </head>
      <body>
        <div class='container'>
          <div class='header'>
            <img src="${logoUrl}" alt="Logo de la empresa" class="logo">
          </div>
          <img src="${imagenUrl}" alt="Imagen del evento" class="image">
          <p class="message">¡Hola! Te recordamos que tienes un evento importante: ${evento}. ¡No te lo pierdas!</p>
          <div>
            ${descripcion}
          </div>  
        </div>
      </body>
    </html>
    `
  }
  static armarPlantillaActivacionCuenta(
    url: string,
    usuario: string,
    contrasena: string
  ) {
    return `
      <!DOCTYPE html>
      <html lang='es'>
        <head>
          <meta charset='UTF-8'>
          <style>
            .container {
              width: 100%;
              max-width: 640px;
              margin-top: 10vh;
            }
          </style>
          <title>Activa tu cuenta</title>
        </head>
        <body>
          <div class='container'>
            Para acceder al sistema ingrese a la siguiente url: <a href='${url}'>${url}</a><br/>
            Los datos de acceso se detallan a continuación:
              <ul>
                <li><b>Usuario:</b></li> ${usuario}
                <li><b>Contraseña:</b></li> ${contrasena}
              </ul>
          </div>
        </body>
      </html>
    `
  }

  static armarPlantillaBloqueoCuenta(url: string) {
    return `
      <!DOCTYPE html>
      <html lang='es'>
        <head>
          <meta charset='UTF-8'>
          <style>
            .container {
              width: 100%;
              max-width: 640px;
              margin-top: 10vh;
            }
          </style>
          <title>Desbloquear cuenta</title>
        </head>
        <body>
          <div class='container'>
            Tu cuenta ha sido bloqueada temporalmente por muchos intentos fallidos de inicio de sesión.<br/>
            Para desbloquear tu cuenta haz clic en la siguiente url: <a href='${url}'>${url}</a><br/>
          </div>
        </body>
      </html>
    `
  }

  static armarPlantillaRecuperacionCuenta(url: string) {
    return `
      <!DOCTYPE html>
      <html lang='es'>
        <head>
          <meta charset='UTF-8'>
          <style>
            .container {
              width: 100%;
              max-width: 640px;
              margin-top: 10vh;
            }
          </style>
          <title>Recupera de cuenta</title>
        </head>
        <body>
          <div class='container'>
            
            Para recuperar tu cuenta haz clic en la siguiente url: <a href='${url}'>${url}</a><br/>
          </div>
        </body>
      </html>
    `
  }

  static armarPlantillaActivacionCuentaManual(url: string) {
    return `
      <!DOCTYPE html>
      <html lang='es'>
        <head>
          <meta charset='UTF-8'>
          <style>
            .container {
              width: 100%;
              max-width: 640px;
              margin-top: 10vh;
            }
          </style>
          <title>Activación de cuenta</title>
        </head>
        <body>
          <div class='container'>
            
            Para activar tu cuenta haz clic en la siguiente url: <a href='${url}'>${url}</a><br/>
          </div>
        </body>
      </html>
    `
  }
}
