

exports.contrarecibo = `
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>
<style>
</style>    
<div id="pageHeader" style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">
    <img src="" width="100px" src="./assets/images/nissan.png" >
    <div  style="border: 1px solid black; width: 100%; height: 100px;background: #dae0e7;text-align: center;">
        <div style="margin-bottom: 20px;margin-top: 20px;">Comercio Automotriz, S.A DE C.V</div>
        <div>Xavier Villaurrutia No. 9950, Zona Rio, Tijuana, RFC: CAU841124QA9</div>
    </div>
  </div>
  <div style="display: flex; flex-direction: column;">
        <table>
        <tr>
            <td>
                <span style="font-weight: 600;">
                    Fecha de recibido:
                </span>
                <span style = "margin-right: 55px;">
                    {{ shipping_date }}
                </span>
            </td>
            <td>
                <span style="font-weight: 600;">
                    Realizado por: 
                </span>
                <span style = "margin-right: 55px;">
                    {{ created_by }}
                </span>
            </td>
        </tr>
        <tr>
            <td>
                <span style="font-weight: 600;">
                    No. Contrarecibo:
                </span>
                <span style = "margin-right: 55px;">
                    {{ id_contrarecibo }}
                </span>
            </td>
            <td>
                <span style="font-weight: 600;">
                    Promesa de pago:
                </span>
                <span>
                    {{ promise_date }}
                </span>
            </td>
        </tr>
        </table>
      <div style="margin-top: 20px; border: 1px solid black;">
          <table style="width: 100%; height: 200px;">
              <thead>
                <tr  style=" padding: 10px 20px;
                display: grid;
                gap: 10px;
                grid-template-columns: repeat(5,1fr);
                align-items: center;
                border-radius: 4px;
                font-weight: 600px;">
                    <td style="font-weight: 600;">
                        Folio
                    </td>
                    <td style="font-weight: 600;">
                        Sucursal
                    </td>
                    <td style="font-weight: 600;">
                        Limite Pago
                    </td>
                    <td style="font-weight: 600;">
                        Importe
                    </td>
                </tr>
              </thead>
              <tbody>
                  {{ list_invoices }}
                  <tr style=" padding: 10px 20px;
                  display: grid;
                  gap: 10px;
                  grid-template-columns: repeat(1,2.08fr) repeat(3,1fr);
                  align-items: center;
                  border-radius: 4px;
                  margin-top: 70px;">
                    <td>

                    </td>
                    <td>

                    </td>
                      <td style="display: flex; justify-content: center; font-weight: 600;">
                          Total Proveedor
                      </td>
                      <td>
                          {{ total }}
                      </td>
                      <td>
                      </td>
                      <td>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
      <div style="width: 100%; margin-top: 20px; text-align: center;" >
          Facturas a revision y pago <b>Martes de 4:00 PM a 6:00 PM</b>
      </div>
  </div>
  <div id="pageFooter" style="border-top: 1px solid #ddd; padding-top: 5px;">
    <p style="color: #666; width: 70%; margin: 0; padding-bottom: 5px; text-align: let; font-family: sans-serif; font-size: .65em; float: left;"></p>
    <p style="color: #666; margin: 0; padding-bottom: 5px; text-align: right; font-family: sans-serif; font-size: .65em">Página </p>
  </div>
</html>
`
