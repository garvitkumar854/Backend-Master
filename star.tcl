 # Create Simulator 
set ns [new Simulator] 

# Trace files 
set tf [open out.tr w] 
$ns trace-all $tf 
set nf [open out.nam w] 
$ns namtrace-all $nf

# Create nodes 
set n0 [$ns node]   ;# Hub 
set n1 [$ns node] 
set n2 [$ns node] 
set n3 [$ns node] 
set n4 [$ns node] 

# Create star topology links 
$ns duplex-link $n0 $n1 1Mb 10ms DropTail 
$ns duplex-link $n0 $n2 1Mb 10ms DropTail 
$ns duplex-link $n0 $n3 1Mb 10ms DropTail 
$ns duplex-link $n0 $n4 1Mb 10ms DropTail

# UDP Agent (Sender) 
set udp [new Agent/UDP] 
$ns attach-agent $n1 $udp 

# Null Agent (Receiver) 
set null [new Agent/Null] 
$ns attach-agent $n3 $null 

# Connect sender to receiver 
$ns connect $udp $null 

# CBR Traffic 
set cbr [new Application/Traffic/CBR] 
$cbr attach-agent $udp 
$cbr set packetSize_ 512 
$cbr set interval_ 0.1 

# Start and Stop 
$ns at 1.0 "$cbr start" 
$ns at 4.0 "$cbr stop" 

# Finish procedure 
proc finish {} { 
global ns tf nf 
$ns flush-trace 
close $tf 
close $nf 
exec nam out.nam & 
exit 0 
} 
$ns at 5.0 "finish" 

# Run simulation 
$ns run