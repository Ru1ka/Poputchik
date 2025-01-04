import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from telegram import Bot
from telegram.ext import Application, CommandHandler
from functools import lru_cache
from pydantic import BaseSettings


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    BOT_TOKEN: str
    CHAT_ID: str

@lru_cache()
def settings():
    return Settings()

app = FastAPI()
bot = Bot(token=settings().BOT_TOKEN)

class Order(BaseModel):
    readable_id: str
    customer_name: str
    customer_phone: str = None
    customer_email: str = None
    weight: int
    cargo: str
    created_at: str
    loading_time: str

    loading_points: list
    unloading_points: list

@app.post("/send_message/")
async def send_message(order: Order):
    order = order.dict()
    text = \
f'''
Новый заказ {order["readable_id"]}

Груз: {order["cargo"]}кг
Вес груза: {order["weight"]}
Имя заказчика: {order["customer_name"]}
Номер заказчика: {order["customer_phone"] or order["customer_email"]}
Время создания: {order["created_at"]}
Время погрузки: {order["loading_time"]}

Путь: {" -> ".join(list(order["loading_points"] + order["unloading_points"]))}
'''
    try:
        await bot.send_message(chat_id=settings().CHAT_ID, text=text)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error sending message")


async def start(update, context):
    await update.message.reply_text('Hello world!')


def main():
    application = Application.builder().token(settings().BOT_TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.run_polling()


if __name__ == '__main__':
    main()
