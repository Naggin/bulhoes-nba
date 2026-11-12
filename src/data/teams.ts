/** Metadados dos 30 times da NBA + coleções especiais. Chave = `Product.time` exatamente como vem no catálogo. */
export interface Team {
  name: string
  short: string        // nome curto: "Lakers"
  abbr: string         // sigla oficial: "LAL"
  city: string
  conference: 'Leste' | 'Oeste' | 'Especial'
  division?: string
  primary: string      // cor principal (hex)
  secondary: string    // cor secundária (hex)
  /** cor do texto sobre `primary` */
  onPrimary: '#ffffff' | '#111111'
}

export const TEAMS: Record<string, Team> = {
  'Atlanta Hawks':          { name: 'Atlanta Hawks', short: 'Hawks', abbr: 'ATL', city: 'Atlanta', conference: 'Leste', division: 'Sudeste', primary: '#C8102E', secondary: '#FDB927', onPrimary: '#ffffff' },
  'Boston Celtics':         { name: 'Boston Celtics', short: 'Celtics', abbr: 'BOS', city: 'Boston', conference: 'Leste', division: 'Atlântico', primary: '#007A33', secondary: '#BA9653', onPrimary: '#ffffff' },
  'Brooklyn Nets':          { name: 'Brooklyn Nets', short: 'Nets', abbr: 'BKN', city: 'Brooklyn', conference: 'Leste', division: 'Atlântico', primary: '#000000', secondary: '#FFFFFF', onPrimary: '#ffffff' },
  'Charlotte Hornets':      { name: 'Charlotte Hornets', short: 'Hornets', abbr: 'CHA', city: 'Charlotte', conference: 'Leste', division: 'Sudeste', primary: '#1D1160', secondary: '#00788C', onPrimary: '#ffffff' },
  'Chicago Bulls':          { name: 'Chicago Bulls', short: 'Bulls', abbr: 'CHI', city: 'Chicago', conference: 'Leste', division: 'Central', primary: '#CE1141', secondary: '#000000', onPrimary: '#ffffff' },
  'Cleveland Cavaliers':    { name: 'Cleveland Cavaliers', short: 'Cavaliers', abbr: 'CLE', city: 'Cleveland', conference: 'Leste', division: 'Central', primary: '#860038', secondary: '#FDBB30', onPrimary: '#ffffff' },
  'Dallas Mavericks':       { name: 'Dallas Mavericks', short: 'Mavericks', abbr: 'DAL', city: 'Dallas', conference: 'Oeste', division: 'Sudoeste', primary: '#00538C', secondary: '#002B5E', onPrimary: '#ffffff' },
  'Denver Nuggets':         { name: 'Denver Nuggets', short: 'Nuggets', abbr: 'DEN', city: 'Denver', conference: 'Oeste', division: 'Noroeste', primary: '#0E2240', secondary: '#FEC524', onPrimary: '#ffffff' },
  'Detroit Pistons':        { name: 'Detroit Pistons', short: 'Pistons', abbr: 'DET', city: 'Detroit', conference: 'Leste', division: 'Central', primary: '#C8102E', secondary: '#1D42BA', onPrimary: '#ffffff' },
  'Golden State Warriors':  { name: 'Golden State Warriors', short: 'Warriors', abbr: 'GSW', city: 'San Francisco', conference: 'Oeste', division: 'Pacífico', primary: '#1D428A', secondary: '#FFC72C', onPrimary: '#ffffff' },
  'Houston Rockets':        { name: 'Houston Rockets', short: 'Rockets', abbr: 'HOU', city: 'Houston', conference: 'Oeste', division: 'Sudoeste', primary: '#CE1141', secondary: '#000000', onPrimary: '#ffffff' },
  'Indiana Pacers':         { name: 'Indiana Pacers', short: 'Pacers', abbr: 'IND', city: 'Indianápolis', conference: 'Leste', division: 'Central', primary: '#002D62', secondary: '#FDBB30', onPrimary: '#ffffff' },
  'LA Clippers':            { name: 'LA Clippers', short: 'Clippers', abbr: 'LAC', city: 'Los Angeles', conference: 'Oeste', division: 'Pacífico', primary: '#C8102E', secondary: '#1D428A', onPrimary: '#ffffff' },
  'Los Angeles Lakers':     { name: 'Los Angeles Lakers', short: 'Lakers', abbr: 'LAL', city: 'Los Angeles', conference: 'Oeste', division: 'Pacífico', primary: '#552583', secondary: '#FDB927', onPrimary: '#ffffff' },
  'Memphis Grizzlies':      { name: 'Memphis Grizzlies', short: 'Grizzlies', abbr: 'MEM', city: 'Memphis', conference: 'Oeste', division: 'Sudoeste', primary: '#5D76A9', secondary: '#12173F', onPrimary: '#ffffff' },
  'Miami Heat':             { name: 'Miami Heat', short: 'Heat', abbr: 'MIA', city: 'Miami', conference: 'Leste', division: 'Sudeste', primary: '#98002E', secondary: '#F9A01B', onPrimary: '#ffffff' },
  'Milwaukee Bucks':        { name: 'Milwaukee Bucks', short: 'Bucks', abbr: 'MIL', city: 'Milwaukee', conference: 'Leste', division: 'Central', primary: '#00471B', secondary: '#EEE1C6', onPrimary: '#ffffff' },
  'Minnesota Timberwolves': { name: 'Minnesota Timberwolves', short: 'Timberwolves', abbr: 'MIN', city: 'Minneapolis', conference: 'Oeste', division: 'Noroeste', primary: '#0C2340', secondary: '#78BE20', onPrimary: '#ffffff' },
  'New Orleans Pelicans':   { name: 'New Orleans Pelicans', short: 'Pelicans', abbr: 'NOP', city: 'Nova Orleans', conference: 'Oeste', division: 'Sudoeste', primary: '#0C2340', secondary: '#C8102E', onPrimary: '#ffffff' },
  'New York Knicks':        { name: 'New York Knicks', short: 'Knicks', abbr: 'NYK', city: 'Nova York', conference: 'Leste', division: 'Atlântico', primary: '#006BB6', secondary: '#F58426', onPrimary: '#ffffff' },
  'Oklahoma City Thunder':  { name: 'Oklahoma City Thunder', short: 'Thunder', abbr: 'OKC', city: 'Oklahoma City', conference: 'Oeste', division: 'Noroeste', primary: '#007AC1', secondary: '#EF5133', onPrimary: '#ffffff' },
  'Orlando Magic':          { name: 'Orlando Magic', short: 'Magic', abbr: 'ORL', city: 'Orlando', conference: 'Leste', division: 'Sudeste', primary: '#0077C0', secondary: '#C4CED4', onPrimary: '#ffffff' },
  'Philadelphia 76ers':     { name: 'Philadelphia 76ers', short: '76ers', abbr: 'PHI', city: 'Filadélfia', conference: 'Leste', division: 'Atlântico', primary: '#006BB6', secondary: '#ED174C', onPrimary: '#ffffff' },
  'Phoenix Suns':           { name: 'Phoenix Suns', short: 'Suns', abbr: 'PHX', city: 'Phoenix', conference: 'Oeste', division: 'Pacífico', primary: '#1D1160', secondary: '#E56020', onPrimary: '#ffffff' },
  'Portland Trail Blazers': { name: 'Portland Trail Blazers', short: 'Trail Blazers', abbr: 'POR', city: 'Portland', conference: 'Oeste', division: 'Noroeste', primary: '#E03A3E', secondary: '#000000', onPrimary: '#ffffff' },
  'Sacramento Kings':       { name: 'Sacramento Kings', short: 'Kings', abbr: 'SAC', city: 'Sacramento', conference: 'Oeste', division: 'Pacífico', primary: '#5A2D81', secondary: '#63727A', onPrimary: '#ffffff' },
  'San Antonio Spurs':      { name: 'San Antonio Spurs', short: 'Spurs', abbr: 'SAS', city: 'San Antonio', conference: 'Oeste', division: 'Sudoeste', primary: '#000000', secondary: '#C4CED4', onPrimary: '#ffffff' },
  'Toronto Raptors':        { name: 'Toronto Raptors', short: 'Raptors', abbr: 'TOR', city: 'Toronto', conference: 'Leste', division: 'Atlântico', primary: '#CE1141', secondary: '#000000', onPrimary: '#ffffff' },
  'Utah Jazz':              { name: 'Utah Jazz', short: 'Jazz', abbr: 'UTA', city: 'Salt Lake City', conference: 'Oeste', division: 'Noroeste', primary: '#002B5C', secondary: '#F9A01B', onPrimary: '#ffffff' },
  'Washington Wizards':     { name: 'Washington Wizards', short: 'Wizards', abbr: 'WAS', city: 'Washington', conference: 'Leste', division: 'Sudeste', primary: '#002B5C', secondary: '#E31837', onPrimary: '#ffffff' },
  'All-Star':               { name: 'All-Star', short: 'All-Star', abbr: 'ASG', city: 'NBA All-Star Game', conference: 'Especial', primary: '#1D428A', secondary: '#C8102E', onPrimary: '#ffffff' },
  'Seleção EUA':            { name: 'Seleção EUA', short: 'Team USA', abbr: 'USA', city: 'Estados Unidos', conference: 'Especial', primary: '#0A3161', secondary: '#B31942', onPrimary: '#ffffff' },
  'Seleção França':         { name: 'Seleção França', short: 'França', abbr: 'FRA', city: 'França', conference: 'Especial', primary: '#002395', secondary: '#ED2939', onPrimary: '#ffffff' },
}

export const teamOf = (name: string): Team =>
  TEAMS[name] ?? { name, short: name, abbr: name.slice(0, 3).toUpperCase(), city: '', conference: 'Especial', primary: '#1D428A', secondary: '#C8102E', onPrimary: '#ffffff' }

export const teamByAbbr = (abbr: string): Team | undefined =>
  Object.values(TEAMS).find(t => t.abbr.toLowerCase() === abbr.toLowerCase())

/** As 30 franquias (sem All-Star/seleções), em ordem alfabética. */
export const FRANCHISES = Object.values(TEAMS).filter(t => t.conference !== 'Especial')
