-- Partner logos: rename "DataCamp Donates" to "DataCamp" and clear the misspelt detail ("DataCamp Dontaes"). Safe to re-run.
UPDATE partners SET name = 'DataCamp', detail = '', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE name = 'DataCamp Donates';
