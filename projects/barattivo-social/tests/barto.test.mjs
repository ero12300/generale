import test from 'node:test';
import assert from 'node:assert/strict';
import {answerBarto} from '../src/barto-bot.js';

const check = (input, snippet, action) => {
  const result=answerBarto(input);
  assert(result.text.includes(snippet), `${input}: expected ${snippet}`);
  if(action)assert(result.actions.some(item=>item.id===action), `action ${action} missing for ${input}`);
  assert(!/sk_test_|secret|personal chat/i.test(result.text));
};
test('orienta nella ricerca senza inventare annunci',()=>check('cerco una bicicletta','bicicletta','find'));
test('guida alla pubblicazione gratuita',()=>check('pubblicare un annuncio','Servono','publish'));
test('spiega sicurezza',()=>check('come evito truffe?','luoghi pubblici','find'));
test('distingue la chat privata da Barto',()=>check('come funziona la chat?','non leggo né invio','inbox'));
test('missione sociale',()=>check('progetto sociale','riuso','mission'));
test('prezzi e gratuità',()=>check('quanto costa?','gratuiti','mission'));
test('non finge assistenza AI',()=>check('parlami di astrofisica','Non sono ancora un assistente AI','find'));
test('ricerca sanitizzata e limitata',()=>{
  const result=answerBarto('cerco '+ 'x'.repeat(400));
  assert(result.text.length<500);
  assert(result.actions.length>0);
});