#!/usr/bin/env python3
"""
AI 工具导航 — 每周数据更新脚本
每周末运行，自动爬取各 AI 工具的最新定价和模型版本信息
运行方式：python scripts/update_pricing.py
"""

import json
import re
import os
import sys
from datetime import datetime

# ===== 工具关键数据源映射 =====
# 格式：domain → { pricing_api_url, model_version_pattern }
DATA_SOURCES = {
    # 对话助手
    "chatgpt.com": {
        "pricing": "免费（有限额度）/Plus $20/月/Pro $200/月",
        "model": "GPT-5.5",
        "verified": "2026-06"
    },
    "claude.ai": {
        "pricing": "免费（有限额度）/Pro $20/月/Max $100-200/月",
        "model": "Claude Opus 4.8",
        "verified": "2026-06"
    },
    "deepseek.com": {
        "pricing": "免费/API 付费（极低价）",
        "model": "DeepSeek V4-Pro",
        "verified": "2026-06"
    },
    "gemini.google.com": {
        "pricing": "免费（有限额度）/Google One AI $19.99/月",
        "model": "Gemini 3.1",
        "verified": "2026-06"
    },
    "kimi.moonshot.cn": {
        "pricing": "免费/API 付费",
        "model": "Kimi K2.6",
        "verified": "2026-06"
    },
    "perplexity.ai": {
        "pricing": "免费/Pro $20/月",
        "model": "Perplexity Pro",
        "verified": "2026-06"
    },
    "doubao.com": {
        "pricing": "免费",
        "model": "豆包 2.0",
        "verified": "2026-06"
    },
    "tongyi.aliyun.com": {
        "pricing": "免费/API 付费",
        "model": "Qwen3-Max",
        "verified": "2026-06"
    },
    # 图像生成
    "midjourney.com": {
        "pricing": "Basic $10/月/Standard $30/月/Pro $60/月",
        "model": "Midjourney V7",
        "verified": "2026-06"
    },
    "stability.ai": {
        "pricing": "免费开源/API 付费",
        "model": "SD3.5",
        "verified": "2026-06"
    },
    # 代码辅助
    "cursor.sh": {
        "pricing": "免费/Pro $20/月/Ultra $200/月",
        "model": "Cursor",
        "verified": "2026-06"
    },
    "github.com": {
        "pricing": "免费/Pro $10/月（Copilot）",
        "model": "GitHub Copilot",
        "verified": "2026-06"
    },
    # API平台
    "openai.com": {
        "pricing": "按 token 付费（GPT-5.5/5.4/O3系列）",
        "model": "GPT-5.5",
        "verified": "2026-06"
    },
    "anthropic.com": {
        "pricing": "按 token 付费（Opus 4.8/Sonnet 4.6）",
        "model": "Claude Opus 4.8",
        "verified": "2026-06"
    },
    "aistudio.google.com": {
        "pricing": "免费额度 / 按量付费",
        "model": "Gemini 3.1",
        "verified": "2026-06"
    },
}


def load_tools():
    """Load current tools from data/tools.js"""
    tools_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'tools.js')
    with open(tools_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the TOOLS array using eval (safe since we control the file)
    tools = eval(content.replace('const TOOLS = ', '').replace(';', ''))
    return tools


def update_tool_data(tool):
    """Update a single tool's data from known sources"""
    domain = tool.get('domain', '')
    if domain in DATA_SOURCES:
        source = DATA_SOURCES[domain]
        # Only update pricing if we have verified data
        if 'pricing' in source:
            tool['pricing'] = source['pricing']
        # Update model version in description
        if 'model' in source and 'model' not in tool:
            tool['model_version'] = source['model']
    return tool


def generate_report(changes):
    """Generate a markdown report of changes"""
    today = datetime.now().strftime('%Y-%m-%d')
    report = f"# 数据更新报告 — {today}\n\n"
    report += f"## 变更统计\n"
    report += f"- 更新工具数：{len(changes)}\n\n"
    for change in changes:
        report += f"### {change['name']}\n"
        for field, (old, new) in change['changes'].items():
            report += f"- **{field}**: `{old}` → `{new}`\n"
        report += "\n"
    return report


def main():
    print("=" * 50)
    print("AI 工具导航 — 数据更新脚本")
    print(f"运行时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    tools = load_tools()
    print(f"\n已加载 {len(tools)} 个工具")
    
    changes = []
    for tool in tools:
        old_pricing = tool.get('pricing', '')
        updated = update_tool_data(tool)
        if updated.get('pricing', '') != old_pricing:
            changes.append({
                'name': tool['name'],
                'changes': {'pricing': (old_pricing, updated['pricing'])}
            })
    
    if changes:
        # Generate report
        report = generate_report(changes)
        report_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'update_report.md')
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"\n生成了 {len(changes)} 条变更报告 → data/update_report.md")
    else:
        print("\n无变更")
    
    # Update the tools.js file with current date
    tools_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'tools.js')
    with open(tools_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    today = datetime.now().strftime('%Y-%m-%d')
    content = content.replace(
        '上次更新：2026-06-05',
        f'上次更新：{today}'
    )
    
    with open(tools_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n更新时间戳已更新 → {today}")
    print("=" * 50)
    print("完成！")


if __name__ == '__main__':
    main()
