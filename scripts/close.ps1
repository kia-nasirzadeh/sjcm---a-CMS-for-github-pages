netstat -ano |
     Select-String "(TCP|UDP)\s+(.+)\:(.+)\s+(.+)\:(\d+)\s+(\w+)\s+(\d+)" |
     ForEach-Object -Process {
         $1 = $_.matches[0].Groups[1].value
         $2 = $_.matches[0].Groups[2].value
         $3 = $_.matches[0].Groups[3].value
         $4 = $_.matches[0].Groups[4].value
         $5 = $_.matches[0].Groups[5].value
         $6 = $_.matches[0].Groups[6].value
         $7 = $_.matches[0].Groups[7].value
         if ([int]$3 -eq 4000) {taskkill /PID $7 /F}
     }
