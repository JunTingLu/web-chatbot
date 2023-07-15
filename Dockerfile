# 使用 Python 官方映像檔作為基礎
FROM python:3.9

# 設定工作目錄
WORKDIR /app

# 複製專案檔案到工作目錄
COPY . .

# 複製並安裝 Python 依賴套件清單
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# RUN pip install -r requirements.txt

# 開放對外連接的埠號
EXPOSE 5000

# 執行 Flask 應用程式
CMD ["flask", "--app", "flask_backend", "run", "--host", "0.0.0.0", "--port", "5000"]

