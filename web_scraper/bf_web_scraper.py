from bs4 import BeautifulSoup
import requests
import re
import datetime
import json
import sys

def get_player_data(player_code):
    '''
        Returns dictionary containing player data that is retrieved 
        from Basketball Reference

            Parameters:
                    player_code (str): String of player's code (i.e. 'jamesle01')

            Returns:
                    data (dict): Dictionary containing player data
    '''

    url = f'https://www.basketball-reference.com/players/{player_code[0]}/{player_code}.html'

    result = requests.get(url)
    doc = BeautifulSoup(result.text, 'html.parser')

    # Data to return
    data = {}

    #####   Getting general info about player   #####
    info = doc.find(id='info')
    meta = info.find('div', id='meta')

    # Image source
    img = meta.find('img')
    if img is not None:
        img_link = img.attrs.get('src')
        data['image_src'] = img_link
    else:
        data['image_src'] = None

    # General info
    nicknames_para = meta.find('p', string=re.compile('^\s*\(.+\)\s*$'))
    if nicknames_para is not None:
        nicknames = nicknames_para.string[nicknames_para.string.find('(') + 1 : nicknames_para.string.find(')')]
        data['nicknames'] = nicknames
    else:
        data['nicknames'] = 'N/A'

    positions_strong = meta.find('strong', string=re.compile('^\s*Position:\s*$'))
    if positions_strong is not None:
        positions_str = positions_strong.next_sibling
        positions_str2 = positions_str.replace(', and', ',').replace('and', ',')
        kept_chars = ['S', 'F', 'P', 'G', 'C', ',']
        filtered_chars = list(filter(lambda x: x in kept_chars, positions_str2))
        positions = ''.join(filtered_chars).replace(',', ', ')
        data['positions'] = positions
    else:
        data['positions'] = 'N/A'    

    height_span = meta.find('span', string=re.compile('^\d-\d{1,2}$'))
    weight_span = meta.find('span', string=re.compile('^\d{3}lb$'))
    if (height_span is not None) and (weight_span is not None):
        height_str = height_span.string.replace('-', 'ft ') + 'in, '
        weight_str = weight_span.string.replace('lb', ' lbs')
        bmi = height_str + weight_str
        data['bmi'] = bmi
    else:
        data['bmi'] = 'N/A'

    birth_span = meta.find('span', id='necro-birth')
    if birth_span is not None:
        birth = birth_span.attrs.get('data-birth')
        data['dob'] = birth
    else:
        data['dob'] = 'N/A'

    birthplace_span = birth_span.next_sibling.next_sibling
    if birthplace_span is not None:
        span_children = list(birthplace_span.children)
        city_text = span_children[0]
        city = city_text[city_text.find(u'\xa0') + 1 : city_text.find(',')]
        territory = span_children[1].string
        birthplace = city + ', ' + territory
        data['birthplace'] = birthplace
    else:
        data['birthplace'] = 'N/A'

    debut_strong = meta.find('strong', string=re.compile('^\s*NBA Debut:\s*$'))
    if debut_strong is not None:
        debut_str = debut_strong.next_sibling.string
        debut = datetime.datetime.strptime(debut_str, '%B %d, %Y').strftime('%Y-%m-%d')
        data['debut'] = debut
    else:
        data['debut'] = 'N/A'

    seasons_strong = meta.find('strong', string=re.compile('^\s*(Experience:|Career Length:)\s*$'))
    if seasons_strong is not None:
        seasons_str = seasons_strong.next_sibling.string 
        seasons = int(re.sub('\D', '', seasons_str))
        data['seasons'] = seasons
    else:
        data['seasons'] = 'N/A'
    

    #####   Getting player status   #####
    stats_div = info.find('div', class_='stats_pullout')
    if stats_div is not None:
        stats_strong = stats_div.find_all('strong')
        stats_list = list(map(lambda t: t.string, stats_strong))
        
        year_now = datetime.datetime.now().year
        current_season = str(year_now - 1) + '-' + str(year_now)[2:]

        if current_season in stats_list:
            data['status'] = 'Active'
        else:
            data['status'] = 'Inactive/Retired'
    else:
        data['status'] = 'N/A'


    #####   Getting awards player earned   #####
    awards_ul = info.find('ul', id='bling')
    if awards_ul is not None:
        awards_hrefs = awards_ul.find_all('a')
        awards_list = list(map(lambda t: t.string, awards_hrefs))
        awards = ', '.join(awards_list)
        data['awards'] = awards
    else:
        data['awards'] = 'N/A'


    #####   Getting career stats of player   #####
    table = doc.find(id='per_game')

    # Career averages
    table_footer = table.find('tfoot')
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
                percentage = round(float(td.string) * 100, 1)
                stats[data_stat] = percentage
            else:
                stats[data_stat] = round(float(td.string), 1)
    for s in stats:
        if stats[s] is None:
            stats[s] = 'N/A'
    data['stats'] = stats

    # Teams played
    table_body = table.find('tbody')
    td_list = table_body.find_all('td', class_='left')
    teams_td = list(filter(lambda t: t.attrs.get('data-stat') == 'team_id', td_list))
    teams_list = list(map(lambda t: t.string, teams_td))
    teams = []
    for t in teams_list:
        if (t not in teams) and (t != 'TOT'):
            teams.append(t)
    if len(teams) != 0:
        data['teams'] = ', '.join(teams)
    else:
        data['teams'] = 'N/A'


    return data


# Main Script
player_code = sys.argv[1] 

if player_code is not None:
    data = get_player_data(player_code)
    print(json.dumps(data))

sys.stdout.flush()

