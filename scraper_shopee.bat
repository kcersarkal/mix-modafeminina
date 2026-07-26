@echo off
title Scraper Shopee Moda Feminina
cd /d "E:\OPENCODE\INDEX  SITE\index mix moda feminia"

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
