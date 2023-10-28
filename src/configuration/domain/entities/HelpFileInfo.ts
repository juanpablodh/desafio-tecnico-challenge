/* eslint-disable @typescript-eslint/no-extraneous-class */

export class HelpFileInfo {
  public static getMimeTypesList (): {} {
    return [
      {
        name: 'application/octet-stream',
        extension: '',
        comment: 'Generic MIME type'
      },
      {
        name: 'text/csv',
        extension: '.csv'
      },
      {
        name: 'text/plain',
        extension: '.txt'
      },
      {
        name: 'application/jsonlines',
        extension: '.jsonlines'
      }
    ]
  }

  public static getEncodingList (): string[] {
    return [
      'ascii', 'utf8', 'utf-8', 'utf16le', 'utf-16le', 'ucs2', 'ucs-2', 'base64', 'base64url', 'latin1', 'binary', 'hex'
    ]
  }
}
