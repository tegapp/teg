import * as qrcode from 'qrcode-terminal'
import bs58 from 'bs58'

export const INVITE_PROTOCOL_VERSION = 'A'

const displayInviteInConsole = ({ hostPublicKey, invite }) => {
  const invitePayload = [
    INVITE_PROTOCOL_VERSION,
    hostPublicKey,
    bs58.encode(Buffer.from(invite.privateKey, 'hex')),
  ]

  const inviteString = invitePayload.join('')

  const consoleLine = `${'='.repeat(80)}\n`

  qrcode.generate(inviteString, { small: true }, (qr) => {
    /* eslint-disable no-console, prefer-template, comma-dangle */
    console.error(
      '\n\n\n'
      + consoleLine
      + 'Invite Code\n'
      + consoleLine
      + `${qr}\n`
      + `${inviteString}\n\n`
      + 'Your almost ready to start 3D Printing! To connect to your printer:\n\n'
      + '1. Install the Beaker Distributed Web Browser from https://beakerbrowser.com/\n'
      + '2, Go to dat://tegh.io and use the Invite Code above.\n\n'
      + consoleLine
      + '\n'
    )
    /* eslint-enable */
  })
}

export default displayInviteInConsole
