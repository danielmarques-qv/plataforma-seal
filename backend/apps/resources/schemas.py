"""
Pydantic schemas for Resources API endpoints.
"""
from typing import Optional, List
from datetime import datetime
from ninja import Schema


class ResourceOutSchema(Schema):
    """Schema de saída para recursos."""
    id: int
    title: str
    description: Optional[str] = None
    category: str
    file_url: str
    thumbnail_url: Optional[str] = None
    file_type: Optional[str] = None
    order_index: int
    download_count: int


class ResourcesByCategorySchema(Schema):
    """Schema para recursos agrupados por categoria."""
    SCRIPT: List[ResourceOutSchema] = []
    PLAYBOOK: List[ResourceOutSchema] = []
    TEMPLATE: List[ResourceOutSchema] = []
    GUIDE: List[ResourceOutSchema] = []
    total_count: int = 0


class CategoryStatsSchema(Schema):
    """Schema para estatísticas por categoria."""
    category: str
    category_display: str
    count: int
    total_downloads: int
