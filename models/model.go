package models

import (
	"database/sql/driver"
	"fmt"
	"time"
)

type CustomTime struct {
	time.Time
}

func (ct *CustomTime) MarshalJSON() ([]byte, error) {
	formatted := fmt.Sprintf("\"%s\"", ct.Format("02-01-2006"))
	return []byte(formatted), nil
}

func (ct *CustomTime) UnmarshalJSON(b []byte) error {
	layout := "02-01-2006"
	parsedTime, err := time.Parse(`"`+layout+`"`, string(b))
	if err != nil {
		return err
	}
	ct.Time = parsedTime
	return nil
}

func (ct CustomTime) Value() (driver.Value, error) {
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

