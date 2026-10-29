"""
@generated_by_model gpt-6
@generated_at 2026-10-24T16:20:00Z
@agent_roles engineering-technical-writer
@vision_command continue_sprint --sprint 4
@sprint_number 4
@task_id T-007
Embed project-required generation metadata in PPTX custom properties and PDF.
"""
import sys
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

META = {
    'generated_by_model': 'gpt-6',
    'generated_at': '2026-10-24T16:20:00Z',
    'agent_roles': 'engineering-technical-writer',
    'vision_command': 'continue_sprint --sprint 4',
    'sprint_number': '4',
    'task_id': 'T-007',
}
if sys.argv[1] == '--from-previews':
    from reportlab.pdfgen import canvas
    preview_dir = Path(sys.argv[2])
    output_pdf = Path(sys.argv[3])
    pages = sorted(preview_dir.glob('slide-*.png'))
    assert len(pages) == 18, 'Expected all eighteen slide previews'
    pdf = canvas.Canvas(str(output_pdf), pagesize=(960, 540))
    pdf.setTitle('Copilot UX components - Microsoft 365 Live 2026')
    for preview in pages:
        pdf.drawImage(str(preview), 0, 0, width=960, height=540)
        pdf.showPage()
    pdf.save()
    target = output_pdf
else:
    target = Path(sys.argv[1])
if target.suffix == '.pdf':
    from pypdf import PdfReader, PdfWriter
    writer = PdfWriter(clone_from=PdfReader(target))
    writer.add_metadata({'/' + key: value for key, value in META.items()})
    writer.add_metadata({'/Title': 'Copilot UX components - Microsoft 365 Live 2026', '/Author': 'GPT-6'})
    revised = target.with_suffix('.metadata.pdf')
    with revised.open('wb') as handle:
        writer.write(handle)
    revised.replace(target)
else:
    cp = 'http://schemas.openxmlformats.org/officeDocument/2006/custom-properties'
    vt = 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes'
    rel = 'http://schemas.openxmlformats.org/package/2006/relationships'
    ct = 'http://schemas.openxmlformats.org/package/2006/content-types'
    with zipfile.ZipFile(target) as archive:
        files = {item.filename: archive.read(item) for item in archive.infolist()}
    props = ET.fromstring(files['docProps/custom.xml']) if 'docProps/custom.xml' in files else ET.Element('Properties', xmlns=cp)
    existing_ids = [int(item.attrib.get('pid', '1')) for item in props]
    next_id = max(existing_ids + [1]) + 1
    for name, value in META.items():
        for item in list(props):
            if item.attrib.get('name') == name:
                props.remove(item)
        prop = ET.SubElement(props, 'property', fmtid='{D5CDD505-2E9C-101B-9397-08002B2CF9AE}', pid=str(next_id), name=name)
        ET.SubElement(prop, f'{{{vt}}}lpwstr').text = value
        next_id += 1
    ET.register_namespace('', cp)
    ET.register_namespace('vt', vt)
    files['docProps/custom.xml'] = ET.tostring(props, encoding='utf-8', xml_declaration=True)
    relations = ET.fromstring(files['_rels/.rels'])
    if not any(item.attrib.get('Target') == 'docProps/custom.xml' for item in relations):
        ET.SubElement(relations, f'{{{rel}}}Relationship', Id='rIdGenerationMetadata', Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties', Target='docProps/custom.xml')
    ET.register_namespace('', rel)
    files['_rels/.rels'] = ET.tostring(relations, encoding='utf-8', xml_declaration=True)
    types = ET.fromstring(files['[Content_Types].xml'])
    if not any(item.attrib.get('PartName') == '/docProps/custom.xml' for item in types):
        ET.SubElement(types, f'{{{ct}}}Override', PartName='/docProps/custom.xml', ContentType='application/vnd.openxmlformats-officedocument.custom-properties+xml')
    ET.register_namespace('', ct)
    files['[Content_Types].xml'] = ET.tostring(types, encoding='utf-8', xml_declaration=True)
    revised = target.with_suffix('.metadata.pptx')
    with zipfile.ZipFile(revised, 'w', zipfile.ZIP_DEFLATED) as archive:
        for name, data in files.items():
            archive.writestr(name, data)
    revised.replace(target)
