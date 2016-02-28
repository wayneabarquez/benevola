#!/usr/bin/env bash

sudo rm /etc/nginx/sites-enabled/default
sudo rm /etc/nginx/sites-available/benevola
sudo rm /etc/nginx/sites-enabled/benevola
sudo cp conf/nginx.conf /etc/nginx/sites-available/benevola
sudo ln -s /etc/nginx/sites-available/benevola /etc/nginx/sites-enabled/benevola
sudo /etc/init.d/nginx reload
