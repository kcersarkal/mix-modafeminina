@echo off
title Scraper Shopee Moda Feminina
cd /d "E:\OPENCODE\INDEX  SITE\index mix moda feminia"

set SHOPEE_APP_ID=18305090601
set SHOPEE_API_KEY=LDDV63HQRMR3SJ2BW7FMBMGASTZWHW6O
set SUPABASE_URL=https://edzagtvukayclklhvokk.supabase.co
set SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkemFndHZ1a2F5Y2xrbGh2b2trIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA2ODM1NCwiZXhwIjoyMTAwNjQ0MzU0fQ.Gw3ue6tsjCROwkWEISdKGkq_0HL37yABAcXQzDmBclc

echo ========================================
echo  Scraper Shopee Moda Feminina
echo  Buscando produtos e salvando no Supabase
echo ========================================
echo.

python scraper_shopee.py

echo.
if %errorlevel% equ 0 (
    echo Scraper concluido com sucesso!
) else (
    echo ERRO: Scraper falhou! Verifique as variaveis de ambiente.
)
echo.
pause
