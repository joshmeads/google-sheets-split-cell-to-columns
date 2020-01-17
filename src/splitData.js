if (!Object.entries) {
  Object.entries = obj => {
    const ownProps = Object.keys(obj);
    let i = ownProps.length;
    const resArray = new Array(i); // preallocate the Array
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]]; // eslint-disable-line
    return resArray;
  };
}

const colLetterToNum = s => s.toLowerCase().charCodeAt(0) - 96;

export default function splitData() {
  const spreadsheet = SpreadsheetApp.getActive();
  const sheet = spreadsheet.getActiveSheet();
  const cell = sheet.getActiveCell();

  const data = cell.getValue().split(', ');
  cell.setValue('');

  const columns = {
    website: 'B',
    username: 'C',
    password: 'D',
    notes: 'E',
    database: 'F',
    host: 'G',
    networkname: 'H',
    key: 'I',
    ipaddress: 'J',
    encryption: 'K'
  };

  const mapped = data.reduce((acc, item) => {
    const y = item
      .replace(':', ':::')
      .split(':::')
      .map(z => z.trim()); // Rather hacker, but to support old JS without lookbacks. Easiest solution to only split on the first instance of :
    if (y.length === 0 || y.length > 2) return acc;
    if (y.length === 1) y.unshift('Notes');
    acc.push(y);
    return acc;
  }, []);

  const insert = (cur, val) => {
    if (!cur) return val;
    return `${cur} | ${val}`;
  };

  const sorted = mapped.reduce(
    (acc, val) => {
      const v = val[0].toLowerCase().replace(/\s/g, '');
      switch (v) {
        case 'website':
        case 'site':
        case 'ftpurl':
        case 'url':
        case 'loginurl':
          acc.website = insert(acc.website, val[1]);
          break;
        case 'username':
        case 'user':
        case 'users':
        case 'email':
        case 'emails':
        case 'emailaddress':
        case 'logon':
        case 'login':
        case 'ftpuser':
        case 'accesskeyid':
        case 'loginuser':
        case 'loginid':
        case 'account':
        case 'drupaluser':
          acc.username = insert(acc.username, val[1]);
          break;
        case 'password':
        case 'pass':
        case 'ftppassword':
        case 'ftppass':
        case 'pw':
        case 'masterpassword':
        case 'secretaccesskey':
        case 'secret':
        case 'drupalpass':
        case 'deploypassword':
          acc.password = insert(acc.password, val[1]);
          break;
        case 'notes':
        case 'note':
          acc.notes = insert(acc.notes, val[1]);
          break;
        case 'database':
        case 'databasename':
        case 'db':
        case 'dbname':
          acc.database = insert(acc.database, val[1]);
          break;
        case 'host':
        case 'hosts':
          acc.host = insert(acc.host, val[1]);
          break;
        case 'networkname':
        case 'network':
          acc.networkname = insert(acc.networkname, val[1]);
          break;
        case 'key':
          acc.key = insert(acc.key, val[1]);
          break;
        case 'ipaddress':
        case 'ip':
        case 'ipaddr':
          acc.ipaddress = insert(acc.ipaddress, val[1]);
          break;
        case 'encryption':
          acc.encryption = insert(acc.encryption, val[1]);
          break;
        default:
          acc.notes = insert(acc.notes, `${val[0]}: ${val[1]}`);
          break;
      }
      return acc;
    },
    {
      website: '',
      username: '',
      password: '',
      notes: '',
      database: '',
      host: '',
      networkname: '',
      key: '',
      ipaddress: '',
      encryption: ''
    }
  );

  Object.entries(sorted).forEach(entry => {
    const [key, value] = entry;
    if (value && key in columns) {
      const cellToUpdate = sheet.getRange(cell.getRow(), colLetterToNum(columns[key]));
      cellToUpdate.setValue(value);
    }
  });

  cell.offset(1, 0).activateAsCurrentCell();
}
