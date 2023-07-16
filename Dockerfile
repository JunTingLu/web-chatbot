# 使用 Python 官方映像檔作為基礎
FROM python:3.9

# 安裝 Nginx
RUN apt-get update && apt-get install -y nginx

# 設定 Nginx 配置文件
# COPY nginx.conf /etc/nginx/nginx.conf

# 設定工作目錄
WORKDIR /app

# 複製 HTML 文件到 Nginx 的默認網站目錄
COPY . /var/www/html

# 複製專案檔案到工作目錄
COPY flask_backend.py .
COPY entrypoint.sh .
COPY config.ini .

# 複製並安裝 Python 依賴套件清單
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# RUN pip install -r requirements.txt

# 開放對外連接的埠號
EXPOSE 80

# 利用bash執行 .sh 腳本
CMD ["bash", "entrypoint.sh"]
