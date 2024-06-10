class APIError(Exception):
    def __init__(self, status_code: int, reason: str):
        self.reason = reason
        self.status_code = status_code
