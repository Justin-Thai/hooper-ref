from bs4 import BeautifulSoup
import requests
import re
import datetime

url = 'https://www.basketball-reference.com/players/j/jamesle01.html'

result = requests.get(url)
doc = BeautifulSoup(result.text, 'html.parser')

# Data to return
result = {}

#####   Getting general info about player   #####
info = doc.find(id='info')
meta = info.find('div', id='meta')

# Image source
img = meta.find('img')
if img is not None:
    img_link = img.attrs.get('src')
    result['image_src'] = img_link

# General info
nicknames_para = meta.find('p', string=re.compile('^\s*\(.+\)\s*$'))
if nicknames_para is not None:
    nicknames = nicknames_para.string[nicknames_para.string.find('(') + 1 : nicknames_para.string.find(')')]
    result['nicknames'] = nicknames

positions_strong = meta.find('strong', string=re.compile('^\s*Position:\s*$'))
if positions_strong is not None:
    positions_str = positions_strong.next_sibling
    kept_chars = ['S', 'F', 'P', 'G', 'C', ',']
    filtered_chars = list(filter(lambda x: x in kept_chars, positions_str))
    positions = ''.join(filtered_chars).replace(',', ', ')
    result['positions'] = positions

height_span = meta.find('span', string=re.compile('^\d-\d{1,2}$'))
weight_span = meta.find('span', string=re.compile('^\d{3}lb$'))
if (height_span is not None) and (weight_span is not None):
    height_str = height_span.string.replace('-', 'ft ') + 'in, '
    weight_str = weight_span.string.replace('lb', ' lbs')
    bmi = height_str + weight_str
    result['bmi'] = bmi

birth_span = meta.find('span', id='necro-birth')
if birth_span is not None:
    birth = birth_span.attrs.get('data-birth')
    result['dob'] = birth

birthplace_span = birth_span.next_sibling.next_sibling
if birthplace_span is not None:
    span_children = list(birthplace_span.children)
    city_text = span_children[0]
    city = city_text[city_text.find(u'\xa0') + 1 : city_text.find(',')]
    territory = span_children[1].string
    birthplace = city + ', ' + territory
    result['birthplace'] = birthplace

debut_strong = meta.find('strong', string=re.compile('^\s*NBA Debut:\s*$'))
debut_year = 0  # To be used later for status 
if debut_strong is not None:
    debut_str = debut_strong.next_sibling.string
    debut = datetime.datetime.strptime(debut_str, '%B %d, %Y').strftime('%Y-%m-%d')
    debut_year = int(datetime.datetime.strptime(debut_str, '%B %d, %Y').strftime('%Y'))
    result['debut'] = debut

seasons_strong = meta.find('strong', string=re.compile('^\s*Experience:\s*$'))
if seasons_strong is not None:
    seasons_str = seasons_strong.next_sibling.string 
    seasons = int(re.sub('\D', '', seasons_str))
    result['seasons'] = seasons

    year_now = datetime.datetime.now().year
    if debut_year + seasons == year_now:
        result['status'] = 'Active'
    else:
        result['status'] = 'Inactive/Retired'



#####   Getting awards player earned   #####
awards_ul = info.find('ul', id='bling')
print(awards_ul)



#####   Getting career stats of player   #####
table = doc.find(id='per_game')
table_footer = table.find('tfoot')

## Career averages
stats_keys = ['g', 'pts_per_g', 'trb_per_g', 'ast_per_g', 'stl_per_g', 'blk_per_g', 'fg_pct', 'fg3_pct', 'ft_pct', 'tov_per_g'] 
stats = {key: None for key in stats_keys}

career_row = table_footer.find('th', string='Career').parent
career_stats = career_row.find_all('td', class_='right')

for td in career_stats:
    data_stat = td.attrs.get('data-stat')
    if data_stat in stats:
        if data_stat == 'g':
            stats[data_stat] = int(td.string)
        elif 'pct' in data_stat:
            percentage = float(td.string) * 100
            stats[data_stat] = percentage
        else:
            stats[data_stat] = float(td.string)
result['stats'] = stats

## Teams played
teams_href = table_footer.find_all('a')
teams = list(map(lambda t: t.string, teams_href))
teams_string = ', '.join(teams)
result['teams'] = teams_string


# # Return results
# print(result)