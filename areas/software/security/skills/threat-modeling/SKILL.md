# Skill: Threat Modeling

## When to load

When designing a new system, adding an integration, reviewing an architecture, or preparing for a security review.

## STRIDE Framework

| Threat | Question | Example |
|:---|:---|:---|
| **S**poofing | Can an attacker impersonate a user/service? | Forged JWT, SSRF to metadata service |
| **T**ampering | Can data be modified in transit/at rest? | SQL injection, cache poisoning |
| **R**epudiation | Can users deny performing an action? | Missing audit logs |
| **I**nformation Disclosure | Can sensitive data be exposed? | Error messages leaking stack traces |
| **D**enial of Service | Can the service be made unavailable? | No rate limiting on public endpoints |
| **E**levation of Privilege | Can a low-privilege user gain higher access? | IDOR, broken object-level authorization |

## IDOR — Most Common API Vulnerability

```python
# ❌ Vulnerable
@app.get("/invoices/{invoice_id}")
def get_invoice(invoice_id: int, current_user: User = Depends(get_current_user)):
    return db.query(Invoice).filter(Invoice.id == invoice_id).first()

# ✅ Safe: always scope to authenticated user
@app.get("/invoices/{invoice_id}")
def get_invoice(invoice_id: int, current_user: User = Depends(get_current_user)):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.owner_id == current_user.id  # ← ownership check
    ).first()
    if not invoice:
        raise HTTPException(status_code=404)  # 404, not 403
    return invoice
```
