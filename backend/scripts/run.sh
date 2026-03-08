#!/bin/bash

poetry run uvicorn src.main:app --port 8000 --reload