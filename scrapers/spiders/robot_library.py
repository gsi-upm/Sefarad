#!/usr/bin/env
#encoding: utf-8

import sys
import pytz, datetime
from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def enviarEmail(remitente, destinatario, mensaje):
	EnviarCorreo = SMTP()
	EnviarCorreo.connect("smtp.gmail.com", 587)
	EnviarCorreo.ehlo()
	EnviarCorreo.starttls()
	EnviarCorreo.ehlo()
	EnviarCorreo.login("internity.km0.alarm@gmail.com", "numero66")

	msg = MIMEMultipart('alternative')
	msg['Subject'] = "Novedades de Internity KM0"
	msg['From'] = remitente
	msg['To'] = destinatario

	msg.attach(MIMEText(mensaje, 'html'))
	
	EnviarCorreo.sendmail(remitente, destinatario, msg.as_string())
	EnviarCorreo.close()

def printDH(mensaje):
	timeLocal = datetime.datetime.now(pytz.timezone('Europe/Madrid'))
	print '%s %s' % (timeLocal.strftime("%d/%m/%Y, %H:%M:%S"), mensaje)
	sys.stdout.flush()

def saveText(text, fileName):
	textutf8 = text.encode('UTF-8')
	text_file = open(fileName, "w")
	text_file.write(textutf8)
	text_file.close()

def error(messageError, driver, html):
	htmlText = ''
	if html is None:
		htmlText = driver.execute_script('return document.documentElement.innerHTML;')
	else: htmlText = html
	timeLocal = datetime.datetime.now(pytz.timezone('Europe/Madrid'))
	fileName = timeLocal.strftime('%d%m%Y%H%M%S')

	saveText(messageError, './errors/%s.txt' % fileName)
	saveText(htmlText, './errors/%s.html' % fileName)
	# Han modificado la web, notificar error
	printDH("ERROR => %s" % messageError)

def seeScreenAndHtml(driver):
	driver.save_screenshot('screen.png')
	res = driver.execute_script('return document.documentElement.innerHTML;')
	saveText(res, 'que_hay.html')