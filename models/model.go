package models

import (
	"database/sql/driver"
	"strings"
	"fmt"
	"time"
)

type CustomTime struct {
	time.Time
}

const ctLayoutISO = "2006-01-02"

func (ct *CustomTime) MarshalJSON() ([]byte, error) {
	if ct.Time.IsZero() { 
        return []byte("null"), nil
    }
	formatted := fmt.Sprintf("\"%s\"", ct.Time.Format(ctLayoutISO))
	return []byte(formatted), nil
}

func (ct *CustomTime) UnmarshalJSON(b []byte) error {
    s := strings.Trim(string(b), "\"") 
    if s == "null" || s == "" {
        ct.Time = time.Time{}
        return nil
	}
	parsedTime, err := time.Parse(ctLayoutISO, s)
	if err != nil {
		return fmt.Errorf("tanggal harus format YYYY-MM-DD: '%s', error: %v", s, err)
	}
	ct.Time = parsedTime
	return nil
}

func (ct CustomTime) Value() (driver.Value, error) {
    if ct.Time.IsZero() {
        return nil, nil
    }
	return ct.Time, nil
}


func (ct *CustomTime) Scan(value interface{}) error {
	switch v := value.(type) {
	case time.Time:
		ct.Time = v
		return nil
	default:
		return fmt.Errorf("failed to scan CustomTime: %v", value)
	}
}

