"""Manual pre-deployment smoke test of DEMO UI only; not real Firebase."""
import subprocess,time
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
server=subprocess.Popen(['python','-m','http.server','8017','--bind','127.0.0.1'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
  time.sleep(.75)
  with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for width in [1365,390]:
      page=browser.new_page(viewport={'width':width,'height':860},device_scale_factor=1)
      failures=[]
      page.on('pageerror',lambda exc:failures.append(str(exc)))
      page.goto('http://127.0.0.1:8017/',wait_until='networkidle',timeout=20000)
      assert 'Barattivo' in page.title()
      assert page.locator('[data-listing]').count() >= 9
      page.locator('[data-filter="service"]').click()
      assert page.locator('[data-category="benessere"]').count()==1
      page.locator('[data-category="benessere"]').click()
      assert page.locator('[data-listing]').count()>=2
      page.locator('#modeFilter').select_option('remote')
      assert page.locator('[data-listing]').count()>=1
      # Demo login
      page.locator('#authButton' if width>650 else '#mobileProfile').click()
      page.locator('#demoAccess').click()
      page.locator('#authButton' if width>650 else '#mobileProfile').click()
      assert page.locator('#profileEditForm').count()==1
      page.locator('input[name="displayName"]').fill('Anna Tester')
      page.locator('input[name="skills"]').fill('Yoga e fitness')
      page.locator('#profileEditForm button[type="submit"]').click()
      assert page.locator('#profileEditForm input[name="displayName"]').input_value()=='Anna Tester'
      page.locator('#closeDialog').click()
      page.locator('#heroPublish' if width>650 else '#mobilePublish').click()
      assert page.locator('#offerCategory option').count()>1
      page.locator('#offerKind').select_option('service')
      page.locator('#offerCategory').select_option('benessere')
      page.locator('#offerSubcategory').select_option('Yoga')
      page.locator('#offerMode').select_option('remote')
      page.locator('input[name="title"]').fill('Sessione yoga da remoto')
      page.locator('textarea[name="description"]').fill('Offro una sessione yoga di esempio, senza spostamenti.')
      page.locator('input[name="want"]').fill('Lezione di italiano')
      page.locator('input[name="city"]').fill('Messina')
      page.locator('#dialogForm button[type="submit"]').click()
      page.wait_for_timeout(400)
      assert page.locator('#appDialog').evaluate('(el)=>!el.open')
      page.locator('[data-filter="service"]').click()
      page.locator('#modeFilter').select_option('remote')
      assert page.locator('[data-listing]').count()>=1
      page.locator('#exchangeWays').click()
      assert 'Banca del tempo e crediti' in page.locator('#dialogBody').inner_text()
      page.locator('#closeDialog').click()
      assert not failures,failures
      if width>650:
        page.screenshot(path='/mnt/data/barattivo_exchange_desktop.png',full_page=True)
      else:
        page.screenshot(path='/mnt/data/barattivo_exchange_mobile.png',full_page=True)
      print('UI passed',width,'px; categories, filters, demo auth, profile and listing publish, no errors.')
      page.close()
    browser.close()
finally: server.terminate();server.wait(timeout=3)